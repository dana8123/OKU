// 상품관련 API
const express = required('express');
export const productRouter = express.Router();

productRouter.get('/:id')
