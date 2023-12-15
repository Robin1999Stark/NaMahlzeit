from rest_framework import serializers
from ..models import Ingredient
from ..unit_synonyms import get_unit_syn_dict


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['title', 'description', 'preferedUnit']

    def get_attribute(self, instance):

        value = super().get_attribute(instance)
        return value

    def to_internal_value(self, data):
        prefered_unit = data.get('preferedUnit', '').lower()
        prefered_unit_synonyms = get_unit_syn_dict()
        mapped_prefered_unit = prefered_unit_synonyms.get(prefered_unit)

        if mapped_prefered_unit:
            data['preferedUnit'] = mapped_prefered_unit
        else:
            raise serializers.ValidationError(
                f"Invalid preferedUnit: {prefered_unit}")

        return super().to_internal_value(data)

    def create(self, validated_data):
        instance = super().create(validated_data)
        return instance
