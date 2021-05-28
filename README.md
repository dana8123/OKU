# OKU

## 사이트 소개

> [myoku.co.kr]()
>
> 오타쿠의 오타쿠에 의한 오타쿠를 위한 경매사이트 OKU

오타쿠들의 니즈를 충족시켜줄 웹서비스 오쿠를 소개합니다.

내가 좋아하는 분야의 굿즈를 이곳에서 좋은 가격에 팔아보자!

그동안 돈 주고도 못샀던 굿즈들 이곳에서 구해보자!

<img src="https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B34.PNG" style="zoom:80%;" />

<img src="https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B35.PNG" style="zoom:80%;" />

![](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B36.PNG)

![7](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B37.PNG)

![8](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B38.PNG)

![](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B39.PNG)

![10](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B310.PNG)

![11](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B311.PNG)

![](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B312.PNG)



![](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B313.PNG)

![](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B314.PNG)

![15](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B315.PNG)

![16](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B316.PNG)

![](https://okuhanghae.s3.ap-northeast-2.amazonaws.com/About+OKU/%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B317.PNG)





## 우리를 소개합니다.

### Backend 

- 팀원 : 김연재, 원가연
- 개발환경 : Node.js
- DB : mongoDB

### Frontend 

- 팀원 : 정성목, 최경민, 최용현
- 개발환경 : React.js

### Designer

- 팀원 : 남유진, 이소희 

## 입찰 & 낙찰

MVP 기간을 거치면서 즉시낙찰 기능에 치명적인 단점을 발견했습니다.

기존 즉시낙찰 기능은 요청하는 즉시 제품의 판매상태가 판매완료로 변경되는 방식이었습니다. 

이 때, 악의적 사용자가 있을 경우 혹은 사용법 미숙지로인해 즉시낙찰을 누를 경우, 제품이 모두 내려가버리는 경험을 했습니다.

그래서, 즉시낙찰의 경우 일반낙찰과는 달리 판매자에게 거래에 대한 의사표현권을 가질 수 있도록 수정했습니다.

#### 기존 즉시 낙찰하기 (수정 전)

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

#### 변경된 즉시 낙찰하기 (수정 후)

```
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

// 유저정보 조회
// 알림안에있는 buyerId값으로 불러옴
exports.buyerCheck = async (req, res) => {
	const { id } = req.params;

	try {
		const buyer = await User.findOne(
			{ _id: id },
			{ nickname: 1, profileImg: 1, _id: 0 }
		);
		res.send({ okay: true, user: buyer });
	} catch (error) {
		res.send({ okay: false, msg: "유저가 존재하지 않습니다." });
	}
};

```

## 입찰하기

입찰하기를 소켓통신으로 구현하느냐, HTTP통신으로 구현하느냐에 대해 고민했습니다.

실시간으로 가격을 업데이트해줘야하니 소켓통신을 하려고 하였지만, 경매의 경우 서버와 클라이언트 간의 양방향 통신보다는 클라이언트의 일방적인 통신이 주를 이루게 될 것이라 예상했다.

그래서 HTTP통신을 채택하게되었고, 

단 유저의 편의상 실시간으로 가격이 올라가는 것 처럼 보일 수 있도록 경매가가 입력될 때 마다 요청을 갱신하였습니다.

## 채팅

거래가 성사 된 유저 간의 소통을 위해 채팅방 시스템을 추가하였습니다.

MVP기간에는 유저와 유저의 정보로만 채팅방을 생성했습니다. 그러다보니 같은 유저간의 거래성사 건에 대해

채팅방이 분리되지않는 문제가 발생했습니다.

그래서 유저와 유저의 정보로 분리하는게 아닌 제품의 정보로 분리하는 방식으로 바꾸게 되었습니다.



또, 채팅방을 생성하는 정보를 어떻게 가져올까 에 대한 고민도 많이 했습니다.

처음에는 낙찰 정보에 대한 DB를 새로 생성하려고 했습니다. 그런데 이렇게하면, 제품DB에 있는 정보를 낙찰DB에도 중복적으로 넣어야 한다는 점이 발생했습니다.

그래서 DB에 있는 정보를 또 생성하기보다는 기존 제품DB에 있던 정보를 쓰는 방향으로 수정하였습니다.

소켓통신은 이번 프로젝트를 하면서 처음 해봐서 엄청 재밌고 어렵게 느껴졌습니다.

