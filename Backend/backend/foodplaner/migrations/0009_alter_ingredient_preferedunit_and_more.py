# Generated by Django 5.0 on 2023-12-15 00:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodplaner', '0008_remove_mealingredient_duration_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='preferedUnit',
            field=models.CharField(choices=[('kg', 'KG'), ('l', 'L'), ('g', 'G'), ('ml', 'ML'), ('stk', 'stk.'), ('tsp', 'TSP'), ('TBSP', 'Tbsp'), ('oz', 'Ounce'), ('cup', 'Cup'), ('gal', 'gallon'), ('pinch', 'prise'), ('drop', 'Tropfen'), ('handful', 'Handful'), ('sprig', 'Zweig'), ('Zehe', 'clove'), ('sheet', 'Blatt'), ('bottle', 'Flasche'), ('bund', 'bunch'), ('Package', 'package'), ('tafel', 'bar')], default='stk', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='inventoryitem',
            name='unit',
            field=models.CharField(choices=[('kg', 'KG'), ('l', 'L'), ('g', 'G'), ('ml', 'ML'), ('stk', 'stk.'), ('tsp', 'TSP'), ('TBSP', 'Tbsp'), ('oz', 'Ounce'), ('cup', 'Cup'), ('gal', 'gallon'), ('pinch', 'prise'), ('drop', 'Tropfen'), ('handful', 'Handful'), ('sprig', 'Zweig'), ('Zehe', 'clove'), ('sheet', 'Blatt'), ('bottle', 'Flasche'), ('bund', 'bunch'), ('Package', 'package'), ('tafel', 'bar')], default='stk', max_length=20),
        ),
        migrations.AlterField(
            model_name='shoppinglist',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 15, 1, 26, 22, 165350)),
        ),
        migrations.AlterField(
            model_name='shoppinglistitem',
            name='added',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 15, 1, 26, 22, 164351)),
        ),
        migrations.AlterField(
            model_name='shoppinglistitem',
            name='unit',
            field=models.CharField(choices=[('kg', 'KG'), ('l', 'L'), ('g', 'G'), ('ml', 'ML'), ('stk', 'stk.'), ('tsp', 'TSP'), ('TBSP', 'Tbsp'), ('oz', 'Ounce'), ('cup', 'Cup'), ('gal', 'gallon'), ('pinch', 'prise'), ('drop', 'Tropfen'), ('handful', 'Handful'), ('sprig', 'Zweig'), ('Zehe', 'clove'), ('sheet', 'Blatt'), ('bottle', 'Flasche'), ('bund', 'bunch'), ('Package', 'package'), ('tafel', 'bar')], default='stk', max_length=20),
        ),
    ]
