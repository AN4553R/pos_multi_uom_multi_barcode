odoo.define('pos_multi_uom_barcode.DB', function(require) {
    'use strict';
    var PosDB = require('point_of_sale.DB');
    const Registries = require('point_of_sale.Registries');

    var models = require('point_of_sale.models');
    var utils = require('web.utils');
    models.load_fields("product.product", ["pos_lines"]);

    PosDB.include({
        init: function(options){
        options = options || {};
        this.name = options.name || this.name;
        this.limit = options.limit || this.limit;

        if (options.uuid) {
            this.name = this.name + '_' + options.uuid;
        }

        //cache the data in memory to avoid roundtrips to the localstorage
        this.cache = {};

        this.product_by_id = {};
        this.product_by_barcode = {};
        this.product_by_barcode_lines = {};
        this.product_by_category_id = {};

        this.partner_sorted = [];
        this.partner_by_id = {};
        this.partner_by_barcode = {};
        this.partner_search_string = "";
        this.partner_write_date = null;
        this.category_by_id = {};
        this.root_category_id  = 0;
        this.category_products = {};
        this.category_ancestors = {};
        this.category_childs = {};
        this.category_parent    = {};
        this.category_search_string = {};
    },

        add_products: function(products){
            var stored_categories = this.product_by_category_id;

            if(!products instanceof Array){
                products = [products];
            }
            for(var i = 0, len = products.length; i < len; i++){
                var product = products[i];
                if (product.id in this.product_by_id) continue;
                if (product.available_in_pos){
                    var search_string = utils.unaccent(this._product_search_string(product));
                    var categ_id = product.pos_categ_id ? product.pos_categ_id[0] : this.root_category_id;
                    product.product_tmpl_id = product.product_tmpl_id[0];
                    if(!stored_categories[categ_id]){
                        stored_categories[categ_id] = [];
                    }
                    stored_categories[categ_id].push(product.id);

                    if(this.category_search_string[categ_id] === undefined){
                        this.category_search_string[categ_id] = '';
                    }
                    this.category_search_string[categ_id] += search_string;

                    var ancestors = this.get_category_ancestors_ids(categ_id) || [];

                    for(var j = 0, jlen = ancestors.length; j < jlen; j++){
                        var ancestor = ancestors[j];
                        if(! stored_categories[ancestor]){
                            stored_categories[ancestor] = [];
                        }
                        stored_categories[ancestor].push(product.id);

                        if( this.category_search_string[ancestor] === undefined){
                            this.category_search_string[ancestor] = '';
                        }
                        this.category_search_string[ancestor] += search_string;
                    }
                }
                this.product_by_id[product.id] = product;
                if(product.barcode){
                    this.product_by_barcode[product.barcode] = product;
                }
                if(product.barcode_lines){
                   for(var i = 0; i < product.barcode_lines.length; i++){
                    this.product_by_barcode_lines[product.barcode_lines[i].barcode] =
                    {
                        'product':product,
                        'price':product.barcode_lines[i].sale_price,
                        'uom':product.barcode_lines[i].uom,
                     };
                   }
                }
            }
    },

        get_product_by_barcode: function(barcode){
              if(this.product_by_barcode_lines[barcode]){
                this.product_by_barcode_lines[barcode]['product'].lst_price = this.product_by_barcode_lines[barcode]['price'];
                var order = this.product_by_barcode_lines[barcode]['product'];
                return order
              } else {
                return undefined;
              }
        },
    })

    return PosDB;
});
