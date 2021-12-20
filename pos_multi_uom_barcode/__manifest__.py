# -*- coding: utf-8 -*-
{
    'name': "POS Multi UoM/Barcodes",

    'summary': """
        Adding multi UoMs and barcodes in POS products
        """,

    'description': """
    using sub-barcodes in the POS scanner instead of the default product barcode
    """,

    'author': "Digizilla",
    'website': "http://digizilla.net",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/14.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'POS',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'product', 'point_of_sale', 'website_sale'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/products.xml',
        'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    "qweb": ["static/src/xml/change_uom.xml"],
}
