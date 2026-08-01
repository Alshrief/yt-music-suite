const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const NodeID3 = require('node-id3');
const musicMetadata = require('music-metadata');
const fetch = require('node-fetch');
const ytDlpExec = require('yt-dlp-exec');

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT_MAIN = process.env.PORT || 3000;
const PORT_DOWNLOAD = 4000;

const MUSIC_DIR = path.join(__dirname, 'music');

if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const metadataCache = new Map();
const activeJobs = new Map();

fs.watch(MUSIC_DIR, { recursive: true }, (eventType, filename) => {
  if (filename && !filename.startsWith('temp_') && !filename.startsWith('thumb_')) {
    metadataCache.clear();
  }
});

function sanitizeFilename(filename) {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTitleAndArtist(rawTitle) {
  let artist = 'فنان غير معروف';
  let title = rawTitle;

  if (rawTitle.includes(' - ')) {
    const parts = rawTitle.split(' - ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  } else if (rawTitle.includes(' – ')) {
    const parts = rawTitle.split(' – ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' – ').trim();
  }

  title = title.replace(/\((Official|Lyric|Audio|Video|Visualizer|HD|4K|Full Video|Music Video)[^)]*\)/gi, '').trim();
  title = title.replace(/\[(Official|Lyric|Audio|Video|Visualizer|HD|4K|Full Video|Music Video)[^\]]*\]/gi, '').trim();

  return { artist, title };
}

// دالة فحص وجود الملف بالمكتبة مسبقاً (Duplicate Checker)
function isTrackAlreadyDownloaded(videoTitle) {
  if (!videoTitle) return false;
  const cleanTitle = sanitizeFilename(videoTitle).toLowerCase();
  
  const files = fs.readdirSync(MUSIC_DIR);
  for (const file of files) {
    const nameWithoutExt = path.parse(file).name.toLowerCase();
    if (nameWithoutExt === cleanTitle || cleanTitle.includes(nameWithoutExt) || nameWithoutExt.includes(cleanTitle)) {
      return file;
    }
  }
  return false;
}

// ==========================================
// 1️⃣ API فحص كشف التكرار (Check Duplicate API)
// ==========================================
app.post('/check-duplicate', (req, res) => {
  const { title } = req.body;
  const existingFile = isTrackAlreadyDownloaded(title);
  
  if (existingFile) {
    return res.json({ exists: true, filename: existingFile, message: 'الأغنية موجودة بالفعل في مكتبتك المحلية' });
  }
  res.json({ exists: false });
});

// ⚡ دالة تنزيل متوازية صاروخية
async function downloadAudioStreamTurbo(url, outputPath) {
  const clients = [
    'youtube:player_client=mweb,android',
    'youtube:player_client=web,mobile',
    'youtube:player_client=android_creator,ios'
  ];

  let lastError = null;

  for (let i = 0; i < clients.length; i++) {
    const clientArg = clients[i];
    try {
      await ytDlpExec(url, {
        format: 'bestaudio/best',
        output: outputPath,
        noCheckCertificates: true,
        noWarnings: true,
        noPlaylist: true,
        geoBypass: true,
        concurrentFragments: 8,
        extractorArgs: clientArg,
        addHeader: [
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'accept-language:en-US,en;q=0.9,ar;q=0.8'
        ]
      });

      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        return true;
      }
    } catch (err) {
      lastError = err;
    }
  }

  try {
    await ytDlpExec(url, {
      format: 'ba/b',
      output: outputPath,
      noCheckCertificates: true,
      geoBypass: true,
      concurrentFragments: 8
    });
    return true;
  } catch (err) {
    throw lastError || err;
  }
}

// ==========================================
// 2️⃣ API بدء التنزيل مع دعم فحص التكرار وإعادة التحميل القسري
// ==========================================
app.post('/download', async (req, res) => {
  const { url, title: videoTitle, thumbnail, force } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'يرجى تقديم رابط الفيديو' });
  }

  // فحص التكرار قبل بدء العملية إلا إذا طلب المستخدم التحميل القسري (force = true)
  if (!force) {
    const existingFile = isTrackAlreadyDownloaded(videoTitle);
    if (existingFile) {
      return res.json({
        alreadyExists: true,
        message: 'هذه الأغنية موجودة بالفعل في مكتبتك المحلية!',
        filename: existingFile
      });
    }
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  activeJobs.set(jobId, { progress: 15, status: 'تنزيل صاروخي 15% ⚡', done: false });

  console.log(`\n🚀 [تنزيل جديد] ID: ${jobId} | ${url}`);
  res.json({ success: true, jobId, message: 'بدأت عملية التنزيل بنجاح' });

  (async () => {
    try {
      const cleanTitle = sanitizeFilename(videoTitle || `track_${Date.now()}`);
      const tempAudioPath = path.join(MUSIC_DIR, `temp_${jobId}.webm`);
      const finalMp3Path = path.join(MUSIC_DIR, `${cleanTitle}.mp3`);
      const coverPath = path.join(MUSIC_DIR, `thumb_${jobId}.jpg`);

      const coverPromise = (async () => {
        if (!thumbnail) return null;
        try {
          const imageRes = await fetch(thumbnail);
          if (imageRes.ok) {
            const buffer = await imageRes.buffer();
            fs.writeFileSync(coverPath, buffer);
            return buffer;
          }
        } catch (e) {}
        return null;
      })();

      activeJobs.set(jobId, { progress: 35, status: 'تنزيل صاروخي 35% ⚡', done: false });
      await downloadAudioStreamTurbo(url, tempAudioPath);

      activeJobs.set(jobId, { progress: 65, status: 'معالجة لـ 320k 65% 🎧', done: false });

      await new Promise((resolve, reject) => {
        ffmpeg(tempAudioPath)
          .toFormat('mp3')
          .audioBitrate(320)
          .audioFrequency(48000)
          .outputOptions([
            '-threads 0',
            '-preset ultrafast'
          ])
          .audioFilters([
            'loudnorm=I=-14:TP=-1:LRA=7',
            'equalizer=f=60:width_type=h:width=40:g=2.5',
            'equalizer=f=12000:width_type=h:width=2000:g=1.5'
          ])
          .on('progress', (p) => {
            if (p.percent) {
              const currentPercent = Math.min(95, Math.max(65, Math.round(65 + (p.percent * 0.3))));
              activeJobs.set(jobId, {
                progress: currentPercent,
                status: `تجهيز 320k (${currentPercent}%) 🎧`,
                done: false
              });
            }
          })
          .on('end', resolve)
          .on('error', reject)
          .save(finalMp3Path);
      });

      if (fs.existsSync(tempAudioPath)) {
        fs.unlinkSync(tempAudioPath);
      }

      activeJobs.set(jobId, { progress: 98, status: 'حفظ التاجات 98% 🖼️', done: false });

      const imageBuffer = await coverPromise;
      const { artist, title } = parseTitleAndArtist(videoTitle || cleanTitle);

      const tags = {
        title: title,
        artist: artist,
        album: 'YouTube Music Ultra High Quality',
        image: imageBuffer ? {
          mime: 'image/jpeg',
          type: { id: 3, name: 'front cover' },
          description: 'Cover Art',
          imageBuffer: imageBuffer
        } : undefined
      };

      NodeID3.write(tags, finalMp3Path);

      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }

      metadataCache.clear();

      activeJobs.set(jobId, {
        progress: 100,
        status: 'تم بنجاح 100% ✅',
        done: true,
        success: true,
        filename: `${cleanTitle}.mp3`
      });

      console.log(`✅ تمت عملية التنزيل بنجاح: ${cleanTitle}.mp3`);

      setTimeout(() => activeJobs.delete(jobId), 30000);

    } catch (error) {
      console.error('❌ خطأ التنزيل:', error);
      activeJobs.set(jobId, {
        progress: 0,
        status: 'فشل التنزيل ❌',
        done: true,
        success: false,
        error: error.message
      });
    }
  })();
});

// ==========================================
// 3️⃣ API الاستعلام عن التقدم
// ==========================================
app.get('/download-status/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = activeJobs.get(jobId);
  if (!job) return res.status(404).json({ error: 'المهمة غير موجودة' });
  res.json(job);
});

// ==========================================
// 4️⃣ APIs استعراض الملفات والبث
// ==========================================
function getAudioFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAudioFilesRecursively(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.mp3', '.m4a', '.flac', '.ogg', '.wav', '.webm', '.aac', '.opus', '.wma'].includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

app.get('/api/tracks', async (req, res) => {
  try {
    const audioFiles = getAudioFilesRecursively(MUSIC_DIR);
    const tracks = [];

    for (const filePath of audioFiles) {
      const relativePath = path.relative(MUSIC_DIR, filePath);
      const filename = path.basename(filePath);
      const stats = fs.statSync(filePath);
      const fileId = Buffer.from(relativePath).toString('hex');

      const cached = metadataCache.get(filePath);
      if (cached && cached.mtime === stats.mtimeMs) {
        tracks.push(cached.data);
        continue;
      }

      let title = path.parse(filename).name;
      let artist = 'فنان غير معروف';
      let album = 'مكتبتي المحلية';
      let duration = 0;
      let hasPicture = false;

      try {
        const metadata = await musicMetadata.parseFile(filePath, { duration: true });
        if (metadata.common.title) title = metadata.common.title;
        if (metadata.common.artist) artist = metadata.common.artist;
        if (metadata.common.album) album = metadata.common.album;
        if (metadata.format.duration) duration = metadata.format.duration;
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          hasPicture = true;
        }
      } catch (err) {
        const parsed = parseTitleAndArtist(title);
        artist = parsed.artist;
        title = parsed.title;
      }

      const trackObj = {
        id: fileId,
        title,
        artist,
        album,
        duration,
        filename,
        relativePath,
        size: stats.size,
        coverUrl: `/api/cover/${fileId}`,
        streamUrl: `/api/stream/${fileId}`,
        hasCover: hasPicture
      };

      metadataCache.set(filePath, { mtime: stats.mtimeMs, data: trackObj });
      tracks.push(trackObj);
    }

    res.json({ tracks });
  } catch (error) {
    console.error('خطأ في جلب قائمة الأغاني:', error);
    res.status(500).json({ error: 'متعذر قراءة الملفات الصوتية' });
  }
});

app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) return res.redirect('/api/tracks');

  try {
    const allRes = await fetch(`http://localhost:${PORT_MAIN}/api/tracks`).then(r => r.json());
    const matched = (allRes.tracks || []).filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.filename.toLowerCase().includes(query)
    );
    res.json({ tracks: matched });
  } catch (err) {
    res.status(500).json({ error: 'خطأ أثناء البحث' });
  }
});

app.get('/api/cover/:id', async (req, res) => {
  try {
    const relativePath = Buffer.from(req.params.id, 'hex').toString('utf8');
    const filePath = path.join(MUSIC_DIR, relativePath);

    if (!fs.existsSync(filePath)) {
      return res.redirect('https://music.youtube.com/img/on_platform_logo_dark.svg');
    }

    const metadata = await musicMetadata.parseFile(filePath);
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const pic = metadata.common.picture[0];
      res.set('Content-Type', pic.format);
      res.set('Cache-Control', 'public, max-age=86400');
      return res.send(pic.data);
    }

    res.redirect('https://music.youtube.com/img/on_platform_logo_dark.svg');
  } catch (error) {
    res.redirect('https://music.youtube.com/img/on_platform_logo_dark.svg');
  }
});

app.get('/api/stream/:id', (req, res) => {
  try {
    const relativePath = Buffer.from(req.params.id, 'hex').toString('utf8');
    const filePath = path.join(MUSIC_DIR, relativePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'الملف الصوتي غير موجود' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp3': 'audio/mpeg',
      '.m4a': 'audio/mp4',
      '.flac': 'audio/flac',
      '.ogg': 'audio/ogg',
      '.wav': 'audio/wav',
      '.webm': 'audio/webm',
      '.aac': 'audio/aac',
      '.opus': 'audio/opus'
    };
    const contentType = mimeTypes[ext] || 'audio/mpeg';

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable');
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end, highWaterMark: 256 * 1024 });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
      });
      fs.createReadStream(filePath, { highWaterMark: 256 * 1024 }).pipe(res);
    }
  } catch (error) {
    console.error('خطأ أثناء بث الصوت:', error);
    res.status(500).json({ error: 'خطأ في بث الملف الصوتي' });
  }
});

app.listen(PORT_MAIN, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 سيرفر يوتيوب ميوزك يعمل مع نظام كشف التكرار والتنبيه:`);
  console.log(`🌐 http://localhost:${PORT_MAIN}`);
  console.log(`======================================================\n`);
});

const expressDownload = express();
expressDownload.use(cors());
expressDownload.use(express.json());
expressDownload.post('/download', (req, res) => app._router.handle(req, res));
expressDownload.post('/check-duplicate', (req, res) => app._router.handle(req, res));
expressDownload.get('/download-status/:jobId', (req, res) => app._router.handle(req, res));
expressDownload.get('/api/tracks', (req, res) => app._router.handle(req, res));

expressDownload.listen(PORT_DOWNLOAD, '0.0.0.0', () => {
  console.log(`⚡ خادم الإضافة مستمع على: http://localhost:${PORT_DOWNLOAD}/download`);
});
