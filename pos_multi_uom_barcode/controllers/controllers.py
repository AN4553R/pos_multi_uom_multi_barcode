# -*- coding: utf-8 -*-
# from odoo import http


# class PosMultiUomBarcode(http.Controller):
#     @http.route('/pos_multi_uom_barcode/pos_multi_uom_barcode/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/pos_multi_uom_barcode/pos_multi_uom_barcode/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('pos_multi_uom_barcode.listing', {
#             'root': '/pos_multi_uom_barcode/pos_multi_uom_barcode',
#             'objects': http.request.env['pos_multi_uom_barcode.pos_multi_uom_barcode'].search([]),
#         })

#     @http.route('/pos_multi_uom_barcode/pos_multi_uom_barcode/objects/<model("pos_multi_uom_barcode.pos_multi_uom_barcode"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('pos_multi_uom_barcode.object', {
#             'object': obj
#         })
