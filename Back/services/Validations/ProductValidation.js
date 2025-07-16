const ProductValidation = (product) => {
    if (product.active) {
        product.active = product.active.split(',') || [];
        if (!product.active.every(item => ['lunchBoxEpitech', 'lunchBoxQuadra', 'aEmporter'].includes(item)))
            throw new Error('');
        if (isDoublonInArray(product.active)) {
            throw new Error('');
        }
    }
}

const isDoublonInArray = (array) => {
    const seen = new Set();
    for (const item of array) {
        if (seen.has(item)) {
            return true; // Doublon trouvé
        }
        seen.add(item);
    }
    return false; // Pas de doublon
}

module.exports = ProductValidation