# -*- coding: utf-8 -*-

from odoo import models, fields, api


class POSMultiUoMBarcodeProducts(models.Model):
    _inherit = 'product.template'
    pos_lines = fields.One2many(comodel_name="f.pos.multi.uom.barcode.lines", inverse_name="uom_barcode")


class POSMultiUoMBarcodeLines(models.Model):
    _name = 'f.pos.multi.uom.barcode.lines'
    uom_barcode = fields.Many2one(comodel_name="product.template")
    uom = fields.Many2one(comodel_name="uom.uom", string="Unit of measure", required=True, )
    barcode = fields.Char(string="", required=True, )
    sale_price = fields.Float(string="Sale price", required=False, )
    _sql_constraints = [
        ('barcode_unique', 'unique (barcode)', "This barcode already exists!"),
    ]
