## 数据库文档

1. web_img

表名： web_img

作者: wu

日期：2019-03-08

版本：1.0

描述：漫画网页图片数据

具体内容：

imgId int 自动增量 图片序号

imgName varchar(40) 图片名称

imgSrc varchar(255) 图片地址

2. web_comic

表名： web_comic

作者: wu

日期：2019-03-08

版本：1.0

描述：漫画网页漫画列表数据

具体内容：

comicId int 自动增量 漫画序号

comicKey varchar(16) 漫画的key

comicName varchar(40) 漫画名称

comicType varchar(10) 漫画类型

comicSrc varchar(255) 漫画位置

comicIntro varchar(255) 漫画简介

comicAuthor varchar(40) 漫画作者

comicCover varchar(255) 漫画封面

3. chapter

表名： *_chapter

作者: wu

日期：2019-03-08

版本：1.0

描述：漫画网页漫画章节数据

具体内容：

chapterId int 自动增量 章节序号

comicKey varchar(16) 漫画的key

chapterName varchar(40) 章节名称

4. comicPage

表名： *_*_comicPage

作者: wu

日期：2019-03-08

版本：1.0

描述：漫画网页漫画具体页面数据

具体内容：

comicPageId int 自动增量 漫画具体页序号

comicKey varchar(16) 漫画的key

comicPageName varchar(20) 漫画具体页的名称

comicPageSrc varchar(255) 漫画具体页的位置

chapterName varchar(30) 漫画章节名