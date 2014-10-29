var fs = require('fs');
var iconv = require('iconv-lite');  //编码转换模块
var phantom = require('phantom');

var url = 'http://item.jd.com/917461.html';
var fileName = 'jd.html';
phantom.create(function(ph) {
        console.log('>>正在加载页面代码，页面地址：%s ', url);
        ph.createPage(function (page) {
            page.open(url,
                function (status) {
                    console.log('>>页面加载状态： %s', status);
                    GetHtml(page, ph);
                });
        });
    }, {
        dnodeOpts: {
            weak: false
        } }
);

function GetHtml(page, ph) {
    page.evaluate(function () {
            return document.documentElement.outerHTML;
        },
        function (result) {
            console.log('>>页面代码已成功抓取...');
            //console.log(result);
            console.log('>>正在保存页面文件...');
            /*由于Node.js仅支持如下编码：utf8, ucs2, ascii, binary, base64, hex，并不支持中文GBK或GB2312之类的编码，
             所以要是采集的页面编码是gbk或gb2312的，则必须对其进行转码，不然会出现乱码的情况
             */
            result = iconv.encode(result,'gb2312');
            fs.writeFile(fileName, result, function (err) {
                if (err) throw err;
                console.log('>>页面文件保存成功，文件名为：%s', fileName);
            });
            ph.exit();
        });
}