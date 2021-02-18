import React, {useEffect, useState, useCallback} from 'react';
import {View, FlatList, Button, Platform, ActivityIndicator, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from "../../store/actions/products"
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(() => {
        setHasError(null)

        dispatch(productsActions.fetchProducts())
            .catch((__) => {
                setHasError(true)
            })

        setIsLoading(false)

    }, [dispatch, setIsLoading, setHasError])

    // If the navigation comes from the navigation drawer, the screen won't refresh
    // since the page is cached
    useEffect(() => {
        setIsLoading(true)
        const subscription = props.navigation.addListener("willFocus", loadProducts)

        // Do some clean up
        return () => {
            subscription.remove()
        }
    }, [loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if (isLoading)
        return (
            <View style={styles.loadingIndicator}>
                <ActivityIndicator
                    size="large"
                    color={Colors.primary}/>
            </View>
        )
    else if (!isLoading && products.length === 0)
        return (
            <View>
                <Text>There was an error loading the content</Text>
            </View>
        )
    else if (hasError)
        return (
            <View>
                <Text>An error has occurred</Text>
                <Button
                    title="Try again"
                    onPress={loadProducts}
                    color={Colors.primary}/>
            </View>
        )

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isLoading}
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}>
                    <Button
                        color={Colors.primary}
                        title="View Details"
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title);
                        }}
                    />
                    <Button
                        color={Colors.primary}
                        title="To Cart"
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }}
                    />
                </ProductItem>
            )}
        />
    );
};

const styles = StyleSheet.create({
    loadingIndicator: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
})

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }}
                />
            </HeaderButtons>
        )
    };
};

export default ProductsOverviewScreen;
