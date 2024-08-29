from rest_framework import serializers
from ..models import CustomUser


class CustomUserCreationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    firstname = serializers.CharField()
    lastname = serializers.CharField()
    birthday = serializers.DateField()
    profilepicture = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password1', 'password2',
                  'firstname', 'lastname', 'birthday', 'profilepicture']

    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    def create(self, validated_data):
        password = validated_data.get('password1')
        username = validated_data['username']
        email = validated_data['email']
        birthday = validated_data['birthday']
        firstname = validated_data['firstname']
        lastname = validated_data['lastname']
        profilepicture = validated_data.get('profilepicture', None)

        user = CustomUser(
            username=username,
            email=email,
            firstname=firstname,
            lastname=lastname,
            birthday=birthday,
            profilepicture=profilepicture
        )

        user.set_password(password)
        user.save()

        return user
