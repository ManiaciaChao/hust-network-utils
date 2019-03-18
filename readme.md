# ![hust-network-utils](logo.png)

-   CampusNet: 认证校园网。
-   <del>Autofee: 银行卡充值一元至电子账户充值网费。</del>
-   NetCommunist: 团体适用的、按需分配的校园网账户公有化方案。

## 部署


```bash
git clone https://github.com/ManiaciaChao/hust-network-utils

cd hust-network-utils

npm install
```

## CampusNet

> 用来连接校园网。

编辑`hust-network-utils`目录下`config.json`，修改如下字段：

```json
    "user": {
        "username": "U2018XXXXX",
        "password": "PASSWORD",
        "defaultFee": "1"
    },
```

## NetCommunist

> 共享同志们的校园网帐号，并检测何时可用。

编辑`hust-network-utils/data`目录下`availAccounts.json`，把对应字段修改为自己的，例如：

```json
    {
        "XH": "U201814XXX",
        "PW": "your_password"
    },
```

修改完成后，执行：

```bash
npm run scan
```

或者：

```bash
yarn scan
```

脚本运行完毕后，会在`hust-network-utils/data`目录下`scan_result_XXXXXXXXXXXXX.csv`文件中存储本次扫描结果。