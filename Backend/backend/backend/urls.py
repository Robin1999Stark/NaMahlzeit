from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from foodplaner.views import MealDetailView, MealListView, FoodPlanerItemDetailView, FoodPlanerItemView

router = routers.DefaultRouter()
router.register(r'meals', MealListView, basename='meal')
router.register(r'planer', FoodPlanerItemView, basename='foodplaneritem')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('meals/<int:pk>/', MealDetailView.as_view(), name='meals-detail'),
    path('planer/<int:pk>/', FoodPlanerItemDetailView.as_view(),
         name='foodplaneritem-detail'),
]
