// 剧情卡片数据
const storyCardsData = [
    ["标题1", "链接1"],
    ["标题2", "链接2"],
    ["标题3", "链接3"]
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 生成剧情卡片
    generateStoryCards();
    // 添加返回按钮事件监听
    addBackButtonListeners();
    // 计算并设置left-panel宽度
    calculateLeftPanelWidth();
});

// 计算并设置left-panel宽度
function calculateLeftPanelWidth() {
    const fixedImage = document.querySelector('.fixed-image');
    if (fixedImage) {
        fixedImage.onload = function() {
            const aspectRatio = fixedImage.naturalWidth / fixedImage.naturalHeight;
            const panelHeight = fixedImage.clientHeight;
            const panelWidth = panelHeight * aspectRatio;
            document.documentElement.style.setProperty('--left-panel-width', `${panelWidth}px`);
        };
        // 确保图片已加载
        if (fixedImage.complete) {
            fixedImage.onload();
        }
    }
}

// 生成剧情卡片
function generateStoryCards() {
    const storyCards = document.getElementById('storyCards');
    storyCards.innerHTML = '';

    storyCardsData.forEach((item, index) => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.style.setProperty('--index', index + 1);
        
        storyCard.innerHTML = `
            <div class="story-card-content">
                <p class="story-title" text-weight="bold">${item[0]}</p>
                <button onclick="window.open('${item[1]}')" class="go-button"></button>
            </div>
        `;
        storyCards.appendChild(storyCard);
    });
}

// 添加返回按钮事件监听
function addBackButtonListeners() {
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 缩小效果
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // 返回上一页
                window.history.back();
            }, 200);
        });
    });
}

// 允许用户动态添加卡片
function addStoryCard(title, link) {
    storyCardsData.push([title, link]);
    generateStoryCards();
}

// APlayer音乐播放器功能
class APlayerManager {
    constructor() {
        this.aplayer = null;
        this.defaultSongId = '2093260104';
        this.init();
    }

    init() {
        this.createAPlayer();
        this.bindEvents();
        this.loadDefaultSong();
    }

    createAPlayer() {
        // 创建APlayer实例
        this.aplayer = new APlayer({
            container: document.getElementById('aplayer'),
            fixed: false,
            autoplay: false,
            theme: '#1976d2',
            loop: 'all',
            order: 'list',
            preload: 'auto',
            volume: 0.7,
            mutex: true,
            lrcType: 3,
            audio: []
        });
    }

    bindEvents() {
        const closeBtn = document.getElementById('closeAplayer');
        closeBtn.addEventListener('click', () => this.toggle());

        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    async loadNeteaseSong(songId) {
        try {
            // 使用Meting API获取网易云音乐歌曲信息
            const response = await fetch(`https://api.i-meto.com/meting/api?server=netease&type=song&id=${songId}`);
            
            if (!response.ok) {
                throw new Error('获取歌曲信息失败');
            }

            const data = await response.json();
            console.log('API返回数据:', data);
            
            if (data && data.length > 0) {
                const song = data[0];
                console.log('原始歌曲对象:', song);
                
                // 智能提取歌曲名
                let songName = '未知歌曲';
                if (song.name && song.name !== '') {
                    songName = song.name;
                } else if (song.title && song.title !== '') {
                    songName = song.title;
                } else if (song.songname && song.songname !== '') {
                    songName = song.songname;
                }
                
                // 智能提取歌手名
                let artistName = '未知歌手';
                if (song.artist && song.artist !== '') {
                    artistName = song.artist;
                } else if (song.author && song.author !== '') {
                    artistName = song.author;
                } else if (song.artists && song.artists.length > 0) {
                    if (typeof song.artists[0] === 'object') {
                        artistName = song.artists[0].name || song.artists[0].author || '未知歌手';
                    } else {
                        artistName = song.artists[0];
                    }
                } else if (song.singer && song.singer !== '') {
                    artistName = song.singer;
                }
                
                // 智能提取封面图
                let coverUrl = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg';
                if (song.pic && song.pic !== '') {
                    coverUrl = song.pic;
                } else if (song.cover && song.cover !== '') {
                    coverUrl = song.cover;
                } else if (song.picUrl && song.picUrl !== '') {
                    coverUrl = song.picUrl;
                } else if (song.image && song.image !== '') {
                    coverUrl = song.image;
                }
                
                // 智能提取播放链接
                let musicUrl = '';
                if (song.url && song.url !== '') {
                    musicUrl = song.url;
                } else if (song.music && song.music !== '') {
                    musicUrl = song.music;
                } else if (song.mp3 && song.mp3 !== '') {
                    musicUrl = song.mp3;
                }
                
                console.log('提取后的信息:', {
                    name: songName,
                    artist: artistName,
                    url: musicUrl ? '有URL' : '无URL',
                    cover: coverUrl
                });
                
                // 如果缺少URL，尝试使用备用方案
                if (!musicUrl) {
                    console.warn('缺少播放链接，尝试构建网易云外链...');
                    musicUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
                }
                
                // 更新APlayer播放列表
                this.aplayer.list.clear();
                this.aplayer.list.add([{
                    name: songName,
                    artist: artistName,
                    url: musicUrl,
                    cover: coverUrl,
                    lrc: song.lrc || song.lyric || ''
                }]);
                
                // 显示播放器并播放
                this.show();
                this.aplayer.play();
            } else {
                throw new Error('未找到歌曲信息');
            }
        } catch (error) {
            console.error('加载网易云音乐失败:', error);
            alert('加载歌曲失败，请检查网络连接或歌曲ID是否正确');
        }
    }

    async loadDefaultSong() {
        // 加载默认歌曲
        console.log('正在加载默认歌曲:', this.defaultSongId);
        await this.loadNeteaseSong(this.defaultSongId);
    }

    show() {
        const container = document.getElementById('aplayerContainer');
        container.classList.add('show');
    }

    hide() {
        const container = document.getElementById('aplayerContainer');
        container.classList.remove('show');
        if (this.aplayer) {
            this.aplayer.pause();
        }
    }

    toggle() {
        const container = document.getElementById('aplayerContainer');
        if (container.classList.contains('show')) {
            this.hide();
        } else {
            this.show();
        }
    }

    // 添加自定义歌曲
    async addCustomSong(songId) {
        if (!songId) return;
        await this.loadNeteaseSong(songId);
    }
}

// 初始化APlayer
document.addEventListener('DOMContentLoaded', function() {
    // 原有的初始化代码
    generateStoryCards();
    addBackButtonListeners();
    calculateLeftPanelWidth();
    
    // 初始化APlayer音乐播放器
    window.aPlayerManager = new APlayerManager();
});

// 快捷播放函数
function playNeteaseMusic(songId) {
    if (window.aPlayerManager) {
        window.aPlayerManager.addCustomSong(songId);
    }
}

// 全局快捷键提示
console.log('音乐播放器快捷键: Ctrl+M 切换显示/隐藏');