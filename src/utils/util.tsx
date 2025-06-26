export function addCommas(price: number | undefined) {
  if (price == null || isNaN(price)) {
    return '';
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
