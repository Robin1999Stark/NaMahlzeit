from rest_framework import serializers
from ..models import CustomUser


class CustomUserCreationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password1',
                  'password2', 'birthday', 'profilepicture']

    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()

        return user
