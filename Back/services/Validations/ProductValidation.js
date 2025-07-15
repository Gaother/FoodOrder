const ProductValidation = (product) => {
    console.log(product.type, ['lunchBoxEpitech', 'lunchBoxQuadra', 'aEmporter'].includes(product.type))
    if (!['lunchBoxEpitech', 'lunchBoxQuadra', 'aEmporter'].includes(product.type))
        throw new Error();
}

module.exports = ProductValidation