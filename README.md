需求说明
==
 1. 进入项目目录，npm install之后，使用npm start查看项目预览，webpack会自动打开localhost。

 2. 需求如下图：
 
 3. 逻辑js在app文件夹中，main.js为主类，在index.js中初始化，data.js为假数据。

 4. 考虑频繁刷新表单数据，所以没有使用table元素。main.js中直接使用addEventListener忽略attachEvent做事件绑定避免冗余代码。
 
![image](https://github.com/sysuzhyupeng/tableData/raw/master/resource/img/require1.png)
![image](https://github.com/sysuzhyupeng/tableData/raw/master/resource/img/require2.png)
