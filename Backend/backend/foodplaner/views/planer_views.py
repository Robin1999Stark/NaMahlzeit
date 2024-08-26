from django.http import HttpResponseBadRequest, JsonResponse
from ..models import FoodPlanerItem, Meal
from ..serializers.planer_serializers import FoodPlanerItemSerializer
from django.shortcuts import get_object_or_404
from datetime import datetime
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.http import JsonResponse
from datetime import datetime
from django.shortcuts import get_object_or_404
from rest_framework import status


class FoodPlanerItemView(viewsets.ModelViewSet):
    queryset = FoodPlanerItem.objects.all()
    serializer_class = FoodPlanerItemSerializer

    def create(self, request, *args, **kwargs):
        date_str = request.data.get('date')
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({'error': 'Invalid date format. Expected format: YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        existing_item = FoodPlanerItem.objects.filter(date=date).first()
        if existing_item:
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)


class FoodPlanerItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodPlanerItem.objects.all()
    serializer_class = FoodPlanerItemSerializer


def move_to_day(request, to_planer, from_planer, meal_id):
    if request.method != 'GET':
        return HttpResponseBadRequest("Only GET requests are allowed for this view.")

    if to_planer is None:
        return HttpResponseBadRequest("to planer parameter is missing")

    if from_planer is None:
        return HttpResponseBadRequest("from planer parameter is missing")

    if meal_id is None:
        return HttpResponseBadRequest("meal id parameter is missing")

    try:
        from_planer_date = datetime.strptime(from_planer, "%Y-%m-%d").date()
        to_planer_date = datetime.strptime(to_planer, "%Y-%m-%d").date()
    except ValueError:
        return HttpResponseBadRequest("Invalid date format for 'from_planer' or 'to_planer'. Expected format: YYYY-MM-DD.")

    meal = get_object_or_404(Meal, id=meal_id)
    from_planer_item = FoodPlanerItem.objects.filter(
        date=from_planer_date).first()
    if not from_planer_item:
        return HttpResponseBadRequest("No planner item found for the 'from_planer' date.")

    if not from_planer_item.meals.filter(id=meal_id).exists():
        return HttpResponseBadRequest("Meal not found in the 'from_planer' date.")

    to_planer_item = FoodPlanerItem.objects.filter(date=to_planer_date).first()
    if not to_planer_item:
        to_planer_item = FoodPlanerItem(date=to_planer_date)
        to_planer_item.save()

    from_planer_item.meals.remove(meal)
    to_planer_item.meals.add(meal)

    return JsonResponse(data={'message': 'Meal moved successfully.'}, status=200)


def remove_meal_from_planer_item(request, planer_date, meal_id):
    if request.method != 'GET':
        return HttpResponseBadRequest("Only GET requests are allowed for this view.")

    if planer_date is None:
        return HttpResponseBadRequest("planer_date parameter is missing")

    if meal_id is None:
        return HttpResponseBadRequest("meal_id parameter is missing")

    try:
        planer_date = datetime.strptime(planer_date, "%Y-%m-%d").date()
    except ValueError:
        return HttpResponseBadRequest("Invalid date format for 'planer_date'. Expected format: YYYY-MM-DD.")

    meal = get_object_or_404(Meal, id=meal_id)
    planer_item = FoodPlanerItem.objects.filter(date=planer_date).first()

    if not planer_item:
        return HttpResponseBadRequest("No planner item found for the specified date.")

    if not planer_item.meals.filter(id=meal_id).exists():
        return HttpResponseBadRequest("Meal not found in the planner item for the specified date.")

    planer_item.meals.remove(meal)
    planer_item.save()

    return JsonResponse(data={'message': 'Meal removed successfully.'}, status=200)
