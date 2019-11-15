#APMC
-
 使用ampc可以帮助你更快的将你的代码放入指定的位置目录，可以将代码推送到指定的服务器目录（正在开发中），这是我个人做的一个方便我自己部署的工具，如果有什么更好的建议或者有缺陷请联系我，帮助我更好的完善。

 
### 怎么使用ampc
首先下载ampc到你的项目中
 >npm install ampc --save-dev
 
然后在你的package.json scripts添加一条命令
```
  "ampc": "ampc-cli-service"
```
这样你就可以使用 npm run ampc 进行文件复制或者推送了，但是当你执行时会报错，因为你需要添加一个ampc.config.js到你的项目目录下。

### ampc.config.js的配置项

* buildFileDir string 想要复制或推送的文件源目录，比如```/Users/zhangzhaoyong/SZP-IoT/dist```或者```./dist```
* localConfig object | string  本地的路径配置，如果你想要本地复制可配置此选项

    
    | 配置项 | 类型 | 说明 | 必输 |
	| :------| :------: | :------: | :------: |
	| targetPath | string | 目标路径，支持绝对、相对路径 | Y |
	| backups | boolean | 是否需要备份，默认不备份 | N |
	
* sshConfig object ssh服务器推送配置

	| 配置项 | 类型 | 说明 | 必输 |
	| :------| :------: | :------ |:------: |
	| targetPath | string | 目标路径，支持绝对、相对路径 | Y |
	| backups | boolean | 是否需要备份，默认不备份 | N |
	| host | string | 服务器地址 | N |
	| port | number | ssh连接端口（默认22） | N |
	| username | string | 登录用户名 | N |
	| password | string | 登录密码 | N |
	| typingmode | boolean | 是否选择键入模式，为了防止在配置中暴露地址等<br>登录信息导致的安全问题，设计键入模式，<br>当未检测到host、port、username、password时，<br>会提示输入补全缺失的信息，特别要注意<br>请不要将密码等敏感信息暴露给他人，<br>防止配置信息缺失导致登录错误，建议开启。 | N |
	

   
    