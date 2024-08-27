from ..models import ShoppingList, ShoppingListItem
from rest_framework import viewsets
from ..serializers.shoppinglist_serializers import ShoppingListItemSerializer, ShoppingListSerializer


class ShoppingListView(viewsets.ModelViewSet):
    serializer_class = ShoppingListSerializer
    queryset = ShoppingList.objects.all()


class ShoppingListItemView(viewsets.ModelViewSet):
    serializer_class = ShoppingListItemSerializer
    queryset = ShoppingListItem.objects.all()
