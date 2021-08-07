# 0부터 9까지 뭐든 OKAY! OKU

![image](https://user-images.githubusercontent.com/57881683/120354904-d215d680-c33d-11eb-8133-3e16bfc1cfd8.png)

- [0부터 9까지 뭐든 OKAY! OKU](#0---9------okay--oku)
    
- [UPDATE 및 코드 리팩토링](#update-및-코드-리팩토링)
    
    + [사용법](#사용법)
    + [사이트 주소](#사이트-주소)
    + [시연 영상](#시연-영상)
  + [발표 영상](#발표-영상)
  * [프로젝트 기간](#프로젝트-기간)
  * [팀원소개](#팀원소개)
  * [기술소개](#기술소개)
    + [1. 개발 환경](#1.-개발-환경)
    + [2. 사용 라이브러리](#2---------)
    + [3. 주요 기능](#3------)
    + [4. 개선 사항 및 고민거리](#4.-개선-사항-및-고민거리)
      - [거래 성사 이후 생기는 채팅방](#거래-성사-이후-생기는-채팅방)
      - [정적 이미지파일 S3에 분리하여 저장](#정적-이미지파일-s3에-분리하여-저장)
      - [즉시 낙찰 로직 변경](#즉시-낙찰-로직-변경)
      - [알림 구현](#알림-구현)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

### 사용법

1. `npm install`
2. `npm start` || `node server.js`

- `env` 파일 없이는 정상작동 하지 않습니다.

### 사이트 주소

http://myoku.co.kr/

### 시연 영상

https://www.youtube.com/watch?v=7vrvxDKprsc&feature=youtu.be

### 발표 영상

https://www.youtube.com/watch?v=zbaKZKt4p0U

## 프로젝트 기간

- 2021년 4월 23일 ~ 5월 28일
- 1 ~ 3주 : 기획 및 mvp 개발
- 4주 : 마케팅 및 사용자 피드백 받고나서 개선

## 팀원소개

[about TEAM](https://www.notion.so/90bbb2e5d07941a3a46370e5333c7556)

## 기술소개

### 1. 개발 환경

- Server: AWS EC2(Ubuntu 20.04 LTS)
- Framework: Express(Node.js)
- Database: MongoDB
- Load Balancer: Nginx
- ETC: AWS S3

### 2. 사용 라이브러리

| 라이브러리         |              설명              |
| ------------------ | :----------------------------: |
| joi                |         데이터 정규화          |
| aws-sdk            |               s3               |
| bcrypt             |        비밀번호 암호화         |
| cors               |        교차 리소스 공유        |
| dotenv             | 포트번호, DB비밀번호 등 암호화 |
| helmet             |         http 보안 강화         |
| mongoose           |             몽고DB             |
| jsonwebtoken       |       회원가입 작동 방식       |
| multer & multer-s3 |       이미지 데이터 저장       |
| node-cron          |       낙찰 시스템에 활용       |
| nodemailer         |           외부 알림            |
| passport-kakao     |           소셜로그인           |
| socket.io          |         채팅기능 구현          |

### 3. 주요 기능

| 기능                   | Method |             URL             |                               Response                                |
| ---------------------- | :----: | :-------------------------: | :-------------------------------------------------------------------: |
| 검색                   |  GET   | /product/search?term=검색어 |                             관련 상품정보                             |
| 입찰시도               |  POST  |   /bid/bidtry/:productId    | time:마감이후 & before:직전입찰가보다 낮을때&lowbid:시작가보다 낮을때 |
| 즉시 낙찰하기          |  POST  |   /bid/sucbid/:productId    |     msg: 메인페이지로 reload합니다 or 즉시낙찰에 실패하였습니다.      |
| 이전 입찰정보 불러오기 |  GET   |   /bid/bidinfo/:productId   |                         bid,nickName,createAt                         |
| 알림                   |  GET   |         /bid/alert          |                      okay,notCheck,alreadyCheck                       |
| 카카오로그인           |  POST  |         /user/kakao         |                                 Token                                 |
| 카카오 가입            |  GET   |         /user/kakao         |                                kakaoId                                |

### 4. 개선 사항 및 고민거리

#### 거래 성사 이후 생기는 채팅방

- 채팅방 생성 기준을 유저 -> 제품으로 변경하였습니다.
  - 유저 정보로 생성할 경우, 같은 유저의 제품을 거래할 때 채팅방이 분리가 안되는 문제가 발생했기 때문
- 앞으로 보완할 점 - 채팅내역에 대한 보안
  토큰을 이용한 접근 제한 등을 고려 중

#### 정적 이미지파일 S3에 분리하여 저장

- 정적 이미지를 노드 서버에 저장하면 서버부하 및 클라이언트측 이미지로딩 속도에도 영향을 끼치기 때문에 분리하였음

#### 즉시 낙찰 로직 변경

- 입/낙찰의 경우 첫 기획에서는 구매자가 즉시 낙찰을 누르면 바로 거래가 성사되는 로직이었습니다. 그러나 여기에는 문제가 있었는데요 즉시 낙찰버튼을 누르고도 거래를 진행하지 않는 블랙유저나 실수로 즉시 낙찰한 유저를 고려하지 못했다는 점입니다. 그래서 이를 해결하기 위해 판매자가 직접 즉시낙찰 버튼을 누른 구매자와 거래를 진행할건지 구매자 프로필 모달을 띄워 결정권을 부여하는 방식으로 문제를 해결했습니다.

<details>
<summary>기존의 코드</summary>
<div markdown="1">

```
exports.sucbid = async (req, res) => {
	const user = res.locals.user;
	const productId = req.params;
	const { sucbid, sellerunique } = req.body;

	try {
		if (sellerunique == user.id) {
			res.send({ msg: "판매자는 낙찰하지 못합니다." });
		} else {
			try {
				const hisinfo = await PriceHistory.create({
					productId: productId["id"],
					userId: user["_id"],
					bid: sucbid,
					nickName: user["nickname"],
					userEmail: user["email"],
				});
			} catch (error) {
				res.send({ msg: "낙찰 기록에 실패했습니다." });
			}

			try {
				// 상품 판매 상태 false로 변경
				const product = await Product.findOneAndUpdate(
					{ _id: productId["id"] },
					{ onSale: false, soldBy: user.nickname, soldById: user._id }
				);

				// 즉시낙찰유저제외 history에있는 모든 유저 불러오기
				const a = await PriceHistory.find(
					{
						$and: [
							{ productId: productId["id"] },
							{ userId: { $ne: user["_id"] } },
						],
					},
					{ userId: 1, _id: 0 }
				);

				//낙찰 실패자에게 알림
				await Alert.insertMany(
					a.map((user) => ({
						alertType: "낙찰실패",
						productId: productId["id"],
						productTitle: product["title"],
						userId: user.userId,
					}))
				);

				//낙찰 성공자에게 알림
				await Alert.create({
					userId: user["_id"],
					alertType: "낙찰성공",
					productTitle: product["title"],
					productId: productId["id"],
				});
			} catch (error) {
				res.send({ msg: "제품이 존재하지 않습니다." });
			}

			try {
				await ChatRoom.create({
					productId: productId["id"],
					buyerId: user["_id"],
					sellerId: sellerunique,
				});
			} catch (error) {
				res.send({ msg: "채팅방 생성에 실패했습니다." });
			}

			res.send({ msg: "즉시낙찰에 성공하였습니다." });
		}
	} catch (error) {
		console.log(error);
		res.send({ msg: "즉시낙찰에 실패하였습니다." });
	}
};
```

</div>
</details>

<details>
<summary>변경된 로직</summary>
<div markdown="1">

```
// 변경된 즉시낙찰로직
exports.newsucbid = async (req, res) => {
	const user = res.locals.user;
	const productId = req.params;
	const { sucbid, sellerunique } = req.body;
	// 이미 즉시 낙찰된 기록이 있을 경우 onSale:true , history가 이미 있는경우
	const prehistory = await Alert.findOne({
		alertType: "판매성공",
		productId: productId["id"],
	});

    // 판매 종료된것도 즉시낙찰 못하게 막아야함
    try {
    	// 판매자가 상품을 산다면
    	if (sellerunique == user.id) {
    		console.log("여기서걸리는거야?1");
    		return res.send({ okay: false, msg: "판매자는 낙찰하지 못합니다." });
    		// 판매자 이외의 구매자가 즉시낙찰을 시도함
    	} else {
    		// 이미 누군가 즉시낙찰을 했다면
    		if (prehistory) {
    			console.log("여깁니다.", prehistory);
    			return res.send({ okay: false, msg: "이미 거래중인 물건입니다." });
    			// 즉시낙찰 내역이 없는 경우
    		} else {
    			console.log("sucbid===> db create", sucbid);
    			await PriceHistory.create({
    				productId: productId["id"],
    				userId: user["_id"],
    				bid: sucbid,
    				nickName: user["nickname"],
    			});
    		}

    		// 판매자한테 상품판매알람보내기
    		// 즉시낙찰을 시도한사람이 있을경우 detail페이지에서 데이터는 내려가지않고 거래대기중으로 띄워줘야함
    		const product = await Product.findOneAndUpdate(
    			{ _id: productId["id"] },
    			{ soldBy: "거래대기중" }
    		);
    		console.log("socketController ==>", product);
    		await Alert.create({
    			alertType: "판매성공",
    			buyerId: user["_id"],
    			productTitle: product["title"],
    			productId: productId["id"],
    			userId: sellerunique,
    		});

    		res.send({ okay: true, msg: "즉시낙찰에 성공하였습니다." });
    	}
    } catch (error) {
    	console.log(error);
    	res.send({ msg: "즉시낙찰에 실패하였습니다.", error });
    }

};

```

이후 유저정보 조회

```

// 거래진행 yes or no로 나누어야함
exports.sellerSelct = async (req, res) => {
// 1. true false값 , 2. 판매성공 알람 objectId값이 필요함

    const { decision } = req.body;
    // 알람 objectId값임
    const { id } = req.params;

    //console.log(decision, id);

    try {
    	// 판매자인지 아닌지도 걸려줘야함

    	if (decision == true) {
    		// 거래 진행에 동의한 경우
    		// 1. 판매상품 내리기 2. 채팅방 생기기 3. 구매자들에게 성공알림, 구매실패자들에게 실패알림

    		const info = await Alert.findOne({ _id: id });
    		const buyer = await User.findOne({ _id: info["buyerId"] });

    		console.log("info:", info, "buyer:", buyer);

    		// 판매상품 상태 변경
    		const a = await Product.findOneAndUpdate(
    			{ _id: info["productId"] },
    			{ onSale: false, soldBy: buyer["nickname"], soldById: buyer["_id"] }
    		);

    		// 채팅방 생성
    		const b = await ChatRoom.create({
    			productId: info["productId"],
    			buyerId: info["buyerId"],
    			sellerId: info["userId"],
    		});

    		// 낙찰성공유저제외 history에있는 모든 유저 불러오기
    		const failUser = await PriceHistory.find(
    			{
    				$and: [
    					{ productId: info["productId"] },
    					{ userId: { $ne: info["buyerId"] } },
    				],
    			},
    			{ userId: 1, _id: 0 }
    		);

    		//낙찰 실패자에게 알림
    		const tt = await Alert.insertMany(
    			failUser.map((user) => ({
    				alertType: "낙찰실패",
    				productId: info["id"],
    				productTitle: info["productTitle"],
    				userId: user.userId,
    			}))
    		);

    		//낙찰 성공자에게 알림
    		const tt2 = await Alert.create({
    			userId: info["buyerId"],
    			alertType: "낙찰성공",
    			productTitle: info["productTitle"],
    			productId: info["productId"],
    		});

    		// 판매완료(거래진행중) > 거래완료
    		await Alert.findOneAndUpdate({ _id: id }, { alertType: "거래완료" });

    		return res.send({ okay: true, msg: "상품이 판매 완료 됐습니다." });
    	} else {
    		// 거래 진행에 거절한 경우
    		// alert하나 삭제하기

    		const info = await Alert.findOne({ _id: id });
    		const buyer = await User.findOne({ _id: info["buyerId"] });

    		//낙찰 시도자에게 실패 알림
    		await Alert.create({
    			userId: info["buyerId"],
    			alertType: "낙찰실패",
    			productTitle: info["productTitle"],
    			productId: info["productId"],
    		});

    		const a = await Product.findOneAndUpdate(
    			{ _id: info["productId"] },
    			{ onSale: true, soldBy: null, soldById: null }
    		);
    		await PriceHistory.deleteOne({
    			productId: info["productId"],
    			userId: info["buyerId"],
    		});

    		await Alert.deleteOne({ _id: id });

    		return res.send({ okay: true, msg: "거래가 취소되었습니다." });
    	}

    	return res.send({ okay: true });
    } catch (error) {
    	res.send({ okay: false, msg: "없는 거래입니다." });
    }

};

```

</div>
</details>

#### 알림 구현

- 알림의 경우 판매실패 & 판매성공(즉시낙찰에만 있는로직) > 거래완료 , 즉시낙찰&입찰실패(낙찰한사람제외다른사람),상품낙찰성공(성공한사람만),문의하기&문의답글달렸을때의 경우 알림을 저장합니다. 초기의 알림은 쌓인 알림을 전부 불러와 보여주는 식이었으나 이는 이미 읽은 알림과 읽지 않은 알림을 구분해주지 않아 사용자 입장에서 불편할거란 판단이 들었습니다. 그래서 알림 collection에 view column을 추가해 알림이 추가되면 기본적으로 false상태로 데이터를 collection에 삽입합니다. 이후 alert API를 호출시 notCheck와 alreadyCheck로 데이터를 내려주는데 이때 호출을 한다면 notCheck에 존재하는 모든 데이터들의 view상태를 true로 변경후 collection에 해주어 다음번 호출시엔 alreadyCheck로 내려줍니다.

```

```

## UPDATE 및 코드 리팩토링

1. user validation 코드 수정 (21.07)

   1. 정규식 변경
      - 한글을 제외한 영 대,소문자와 숫자만 닉네임으로 입력되는 등 클라이언트측에서 보이는 조건과 다른 조건으로 정규식이 설정되어 있었음

   ```javascript
   nickname: Joi.string().pattern(
   	new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9]{1,10}$")
   );
   ```

   2. 코드 간소화

      - 좀 더 보기 좋은 코드로 변경하기 위해 `throw` 를 활용

      * https://github.com/danaisboss/OKU/commit/85edf463a6259d723504f0a406d775b62e27e5bc

   3. 중복된(or 잘못된) 변수명 수정
      - 입력과 동시에 유효성 여부를 검사하는 코드와 응답 보내면서 유효성 여부를 검사하는 코드의 변수명이 같아, 가독성 및 에러 방지를 위해 변수명 변경 (ex: `checkEmail` -> `checkEmailForClient` )

2. socket.js 코드 수정 (21.08)
   1. 의도치않은 broadcasting이 되는 문제 수정
      - 서버측에서 전송된 데이터를 모든 클라이언트가 볼 수 있는 broadcasting 이벤트가 발생
      - socket.io의 room 기능에 의한 문제 발생
      - 해당 nameSpace에 접속 할 경우, Default room에서의 분기처리를 이용해 해결
      - https://github.com/danaisboss/OKU/commit/87e14cb7256ae6468378db9faae781f20df71ae5
   2. 실행 코드와 로직 코드의 분리
      - 가독성을 위해 코드 추상화 작업을 하였음
      - https://github.com/danaisboss/OKU/commit/62771d577747f8c40ac337d6c6fbaac2db1f1a76
