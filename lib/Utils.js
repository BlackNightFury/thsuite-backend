const dollarDecimalFormat = new Intl.NumberFormat( 'en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
} )

const dollarFormat = new Intl.NumberFormat( 'en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
} )

module.exports = class Utils {

    static toTitleCase(str) {
        if(!str) return str;

        return str.substr(0, 1).toUpperCase() + str.substr(1);
    }

    static toDollarValue(amount) {
        return dollarDecimalFormat.format( amount )
    }

    static toDollar(amount) {
        return dollarFormat.format( amount )
    }
}
