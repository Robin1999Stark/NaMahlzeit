from rest_framework import serializers
from ..models import InventoryItem


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'ingredient', 'amount', 'unit']

    def create(self, validated_data):
        ingr = validated_data['ingredient']
        items = InventoryItem.objects.filter(
            ingredient=ingr, unit=validated_data['unit'])
        if not items.exists():
            if validated_data['amount'] > 0:
                inventory_item = InventoryItem.objects.create(
                    ingredient=validated_data['ingredient'], amount=validated_data['amount'], unit=validated_data['unit'])
                return inventory_item

        else:
            first = items.first()
            if validated_data['unit'] == first.unit:
                new_amount = first.amount + validated_data['amount']
                if new_amount > 0:
                    first.amount = new_amount
                    first.save()
                else:
                    first.delete()
                return first
            else:
                new_amount = validated_data['amount']
                if new_amount > 0:
                    inventory_item = InventoryItem.objects.create(
                        ingredient=validated_data['ingredient'], amount=new_amount, unit=validated_data['unit'])
                    return inventory_item
                else:
                    pass
        return InventoryItem.objects.first()
