odoo.define('pos_multi_uom_barcode.ProductScreen', function(require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');


    const PosFrProductScreen = ProductScreen => class extends ProductScreen {
        _barcodeProductAction(code) {
            // NOTE: scan_product call has side effect in pos if it returned true.
            if (!this.env.pos.scan_product(code)) {
                this._barcodeErrorAction(code);
            }
            const order = this.env.pos.get_order();
            if(order) {
                if (order.selected_orderline) {
                    const order_line = order.selected_orderline
                    const product = order_line.get_product()
                    for (let unit of this.env.pos.units) {
                        for(let line of order_line.get_product().barcode_lines){
                            if (code.base_code == line.barcode && line.uom[0] == unit.id){
                                order_line.uom_id = unit;
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    Registries.Component.extend(ProductScreen, PosFrProductScreen);
    return ProductScreen;
});