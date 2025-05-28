import django_filters
from .models import Driver

class DriverFilter(django_filters.FilterSet):
    min_experience = django_filters.NumberFilter(
        field_name='experience',
        lookup_expr='gte',
        label='Мінімальний стаж (роки)'
    )
    max_experience = django_filters.NumberFilter(
        field_name='experience',
        lookup_expr='lte',
        label='Максимальний стаж (роки)'
    )
    license_type = django_filters.ChoiceFilter(
        choices=Driver.LICENSE_TYPES,
        label='Тип ліцензії'
    )
    is_active = django_filters.BooleanFilter(
        label='Активний водій'
    )
    is_available = django_filters.BooleanFilter(
        label='Доступний для замовлень'
    )

    class Meta:
        model = Driver
        fields = {
            'name': ['icontains'],
            'license_number': ['exact'],
        }