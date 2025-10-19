import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EmptyState, FilterChip, LoadingState, RecipeCard } from '../../components';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '../../constants/theme';
import { useRecipes, useDebounce } from '../../hooks';
import { Recipe } from '../../types';

// Popular recipe categories
const CATEGORIES = [
  'Italian',
  'Japanese',
  'Mexican',
  'French',
  'Indian',
  'Thai',
  'Chinese',
  'Mediterranean',
  'American',
  'Korean',
];

// Duration filters
const DURATIONS = [
  { label: '< 15 min', value: 'quick', minMinutes: 0, maxMinutes: 15 },
  { label: '15-30 min', value: 'medium', minMinutes: 15, maxMinutes: 30 },
  { label: '> 30 min', value: 'long', minMinutes: 30, maxMinutes: Infinity },
];

export default function HomeScreen() {
  const { recipes, loading, refetch } = useRecipes();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: '/recipe-detail',
      params: { id: recipe.id },
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedDuration(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedDuration;

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search filter
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.toLowerCase();
        const titleMatch = recipe.title.toLowerCase().includes(query);
        const ingredientsMatch = recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(query)
        );
        const categoryMatch = recipe.category?.toLowerCase().includes(query);

        if (!titleMatch && !ingredientsMatch && !categoryMatch) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && recipe.category !== selectedCategory) {
        return false;
      }

      // Duration filter
      if (selectedDuration) {
        const durationFilter = DURATIONS.find((d) => d.value === selectedDuration);
        if (durationFilter) {
          const recipeMinutes = parseInt(recipe.duration?.match(/\d+/)?.[0] || '0');
          // Check if recipe duration is within the filter range
          if (
            recipeMinutes < durationFilter.minMinutes ||
            recipeMinutes > durationFilter.maxMinutes
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [recipes, debouncedSearchQuery, selectedCategory, selectedDuration]);

  if (loading) {
    return <LoadingState message='Loading recipes...' />;
  }

  if (recipes.length === 0 && !loading) {
    return (
      <EmptyState
        icon='📱'
        title='No recipes yet'
        subtitle='Add your first recipe from TikTok or Instagram!'
        actionLabel='+ Add Recipe'
        onAction={() => router.push('/(tabs)/add')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Recipes</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearAllFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
          ]}
        >
          <Ionicons
            name='search'
            size={20}
            color={isSearchFocused ? colors.primary : colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search recipes, ingredients...'
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoCapitalize='none'
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name='close-circle'
              size={20}
              color={colors.text.tertiary}
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>

        {/* Duration Filters */}
        <View style={styles.durationContainer}>
          <Text style={styles.filterLabel}>Duration:</Text>
          <View style={styles.durationChips}>
            {DURATIONS.map((duration) => (
              <FilterChip
                key={duration.value}
                label={duration.label}
                selected={selectedDuration === duration.value}
                onPress={() =>
                  setSelectedDuration(
                    selectedDuration === duration.value ? null : duration.value
                  )
                }
              />
            ))}
          </View>
        </View>

        {/* Category Filters */}
        <View style={styles.categoryContainer}>
          <Text style={styles.filterLabel}>Categories:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((category) => (
              <FilterChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {filteredRecipes.length === 0 ? (
        <View style={styles.emptySearch}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>No recipes found</Text>
          <Text style={styles.emptySearchSubtitle}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    ...shadows.sm,
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    ...shadows.md,
    backgroundColor: colors.white,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  clearIcon: {
    marginLeft: spacing.sm,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationContainer: {
    marginTop: spacing.lg,
  },
  durationChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryContainer: {
    marginTop: spacing.lg,
  },
  categoryScroll: {
    paddingRight: spacing.xl,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  cardWrapper: {
    flex: 1,
    margin: spacing.sm,
  },
  emptySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptySearchIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptySearchTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySearchSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
