from ..models import InventoryItem
from rest_framework import viewsets
from ..serializers.inventory_serializers import InventoryItem, InventoryItemSerializer


class InventoryItemView(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    queryset = InventoryItem.objects.all()
