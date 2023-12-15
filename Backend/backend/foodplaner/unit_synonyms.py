from .models import UnitOptions


def get_unit_syn_dict():
    prefered_unit_synonyms = {
        'kilogram': UnitOptions.KG,
        'kilogramm': UnitOptions.KG,
        'kg': UnitOptions.KG,
        'kilogramm': UnitOptions.KG,

        'liter': UnitOptions.LITER,
        'l': UnitOptions.LITER,
        'liter': UnitOptions.LITER,

        'gram': UnitOptions.GRAM,
        'g': UnitOptions.GRAM,
        'gramm': UnitOptions.GRAM,

        'milliliter': UnitOptions.MILLILITRE,
        'ml': UnitOptions.MILLILITRE,
        'milillilitre': UnitOptions.MILLILITRE,

        'piece': UnitOptions.PIECE,
        'stk': UnitOptions.PIECE,
        'stück': UnitOptions.PIECE,
        'pcs': UnitOptions.PIECE,
        'times': UnitOptions.PIECE,
        'mal': UnitOptions.PIECE,

        'teaspoon': UnitOptions.TEASPOON,
        'tsp': UnitOptions.TEASPOON,
        'tl': UnitOptions.TEASPOON,

        'tablespoon': UnitOptions.TABLESPOON,
        'tbsp': UnitOptions.TABLESPOON,
        'el': UnitOptions.TABLESPOON,

        'ounce': UnitOptions.OUNCE,
        'oz': UnitOptions.OUNCE,
        'unze': UnitOptions.OUNCE,

        'cup': UnitOptions.CUP,
        'c': UnitOptions.CUP,
        'tasse': UnitOptions.CUP,
        'becher': UnitOptions.CUP,

        'gallon': UnitOptions.GALLON,
        'gal': UnitOptions.GALLON,

        'pinch': UnitOptions.PINCH,
        'prise': UnitOptions.PINCH,

        'drop': UnitOptions.DROP,
        'tropfen': UnitOptions.DROP,

        'handful': UnitOptions.HANDFUL,
        'handvoll': UnitOptions.HANDFUL,
        'hand voll': UnitOptions.HANDFUL,

        'sprig': UnitOptions.SPRIG,
        'zweig': UnitOptions.SPRIG,

        'clove': UnitOptions.CLOVE,
        'zehe': UnitOptions.CLOVE,

        'sheet': UnitOptions.SHEET,
        'blatt': UnitOptions.SHEET,
        'leaf': UnitOptions.SHEET,

        'bottle': UnitOptions.BOTTLE,
        'flasche': UnitOptions.BOTTLE,

        'bunch': UnitOptions.BUNCH,
        'bündel': UnitOptions.BUNCH,

        'package': UnitOptions.PACKAGE,
        'packung': UnitOptions.PACKAGE,
        'päckchen': UnitOptions.PACKAGE,
        'pkt': UnitOptions.PACKAGE,

        'tafel': UnitOptions.PACKAGE,
        'tablée': UnitOptions.PACKAGE,
        'bar': UnitOptions.PACKAGE,
        'slab': UnitOptions.PACKAGE,
        'tablet': UnitOptions.PACKAGE,

        'stick': UnitOptions.STICK,
        'stange': UnitOptions.STICK,
        'stem': UnitOptions.STICK,
        'rod': UnitOptions.STICK,
        'roll': UnitOptions.STICK,
        'röhre': UnitOptions.STICK,
        'stiel': UnitOptions.STICK,

        'dose': UnitOptions.CAN,
        'büchse': UnitOptions.CAN,
        'konservendose': UnitOptions.CAN,
        'can': UnitOptions.CAN,
        'tin': UnitOptions.CAN,
        'canning': UnitOptions.CAN,
        'tin can': UnitOptions.CAN,
        'container': UnitOptions.CAN,

    }
    return prefered_unit_synonyms
