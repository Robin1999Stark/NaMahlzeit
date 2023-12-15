# Generated by Django 5.0 on 2023-12-15 21:44

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodplaner', '0010_alter_ingredient_preferedunit_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealingredient',
            name='ingredient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ingredient_to_meal', to='foodplaner.ingredient'),
        ),
        migrations.AlterField(
            model_name='mealingredient',
            name='meal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meal_to_ingredient', to='foodplaner.meal'),
        ),
        migrations.AlterField(
            model_name='shoppinglist',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 15, 22, 44, 30, 247868)),
        ),
        migrations.AlterField(
            model_name='shoppinglistitem',
            name='added',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 15, 22, 44, 30, 247868)),
        ),
    ]
