# Generated by Django 5.0 on 2023-12-14 21:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodplaner', '0006_alter_ingredient_preferedunit_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='mealingredient',
            name='duration',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='mealingredient',
            name='preparation',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='shoppinglist',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 14, 22, 16, 25, 851431)),
        ),
        migrations.AlterField(
            model_name='shoppinglistitem',
            name='added',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 14, 22, 16, 25, 850431)),
        ),
    ]
