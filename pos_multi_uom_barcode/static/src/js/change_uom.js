odoo.define('point_of_sale.ChangeUoM', function(require) {
    'use strict';
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    var models = require('point_of_sale.models');

    models.load_fields("product.product", ["pos_lines"]);

     var _super_orderline = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function(attr, options) {
            _super_orderline.initialize.call(this,attr,options);
            this.uom_id = this.product.get_unit();
        },
        export_as_JSON: function() {
            var result = _super_orderline.export_as_JSON.call(this);
            result.uom_id = this.uom_id;
            return result;
        },
        get_custom_unit: function(){
            return this.uom_id;
        },
        find_reference_unit_price: function(product, product_uom){
            if(product_uom.uom_type == 'reference'){
                return product.lst_price;
            }
            else if(product_uom.uom_type == 'smaller'){
               return (product.lst_price * product_uom.factor);
            }
            else if(product_uom.uom_type == 'bigger'){
               return (product.lst_price / product_uom.factor_inv);
            }
        },
        get_latest_price: function(uom, product, ref_price, product_uom, uom_list){
            console.log(product)
            var ref_unit = null;
            for (var i in uom_list){
                if(uom_list[i].item.uom_type == 'reference'){
                    ref_unit = uom_list[i];
                    break;
                }
            }
            if(ref_unit){
                if(uom.uom_type == 'bigger'){
                    return (ref_price * uom.factor_inv);
                }
                else if(uom.uom_type == 'smaller'){
                    return (ref_price / uom.factor);
                }
                else if(uom.uom_type == 'reference'){
                    return ref_price;
                }
            }
            return product.lst_price;
        },
        export_for_printing: function() {
            var line = _super_orderline.export_for_printing.apply(this,arguments);
            line.unit_name = this.get_custom_unit().name;
            return line;
        },
    });

    class ChangeUoM extends PosComponent {
       async changeUoM() {
         const order = this.env.pos.get_order();
            if(order) {
                if (order.selected_orderline) {
                    const PosUomList = []
                    const order_line = order.selected_orderline
                    const product = order_line.get_product()
                    for (let unit of this.env.pos.units) {
                        for(let pos_line of order_line.get_product().barcode_lines){
                            if (pos_line.uom[0] == unit.id){
                                PosUomList.push({
                                    id: unit.id,
                                    label: unit.name,
                                    item: unit,
                                });
                            }
                        }

                    }
                     const { confirmed, payload: selectedUomId } = await this.showPopup(
                        'SelectionPopup',
                        {
                            title: 'Select UOM',
                            list: PosUomList,
                        }
                    );
                    if (confirmed) {
                        const product_uom = order_line.get_unit();

                        var latest_price = order_line.get_product().lst_price;
                        for(let line of order_line.get_product().barcode_lines)
                        {
                            if(line.uom[0] == selectedUomId.id) {
                                latest_price = line.sale_price;
                                break;
                            }
                        }
                        order_line.uom_id = selectedUomId;
                        order_line.set_unit_price(latest_price);
                        order_line.price = latest_price;
                    }
                }
            }
        }
    }
    ChangeUoM.template = 'ChangeUoM';
    Registries.Component.add(ChangeUoM);

    return ChangeUoM;
});
