// ProductPage.jsx
import { Content } from 'antd/es/layout/layout';
import { Card, Button, List, Modal, Space, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente de Produto da Loja
const Product = ({ product, onToggleFavorite }) => (
    <Card
        hoverable
        style={{ marginBottom: 16 }}
        cover={
            <Link to={`/product/${product.id}`}>
                {product.imageUrl ? (
                    <img alt={product.name} src={product.imageUrl} />
                ) : (
                    <div
                        style={{
                            height: 200,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Sem Imagem
                    </div>
                )}
            </Link>
        }
    >
        <Card.Meta
            title={<Link to={`/product/${product.id}`}>{product.name}</Link>}
            description={`${product.description} - R$ ${product.price}`}
        />
        <Button
            type="primary"
            onClick={() => onToggleFavorite(product.id)}
            style={{ marginTop: 16 }}
        >
            {product.isFavorite ? 'Desfavoritar' : 'Favoritar'}
        </Button>
    </Card>
);

// Página da Loja
function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const requestProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/product');
            // Simular o estado de favoritados a partir de uma estrutura de favoritos retornada
            const favoriteResponse = await axios.get('/favorite');
            const favoriteProductIds = new Set(favoriteResponse.data.map(favorite => favorite.ProductId));
            const productsWithFavoriteStatus = response.data.map(product => ({
                ...product,
                isFavorite: favoriteProductIds.has(product.id),
            }));
            setProducts(productsWithFavoriteStatus);
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: 'Não foi possível carregar os produtos, tente novamente mais tarde.',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (productId) => {
        const product = products.find(p => p.id === productId);
        try {
            setLoading(true);
            if (product.isFavorite) {
                await axios.delete(`/favorite/${productId}`);
                Modal.success({
                    title: 'Produto desfavoritado com sucesso!',
                });
            } else {
                await axios.post(`/favorite/${productId}`);
                Modal.success({
                    title: 'Produto favoritado com sucesso!',
                });
            }
            // Atualizar o estado do produto
            setProducts(products.map(p =>
                p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
            ));
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: 'Não foi possível processar, tente novamente mais tarde.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        requestProducts();
    }, []);

    return (
        <Content style={{ padding: '0 50px' }}>
            <h1>Produtos da Loja</h1>
            <Space direction="vertical" style={{ display: 'flex' }}>
                <Row justify="center">
                    <Col span={23}>
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={products}
                            loading={loading}
                            renderItem={product => (
                                <List.Item>
                                    <Product product={product} onToggleFavorite={toggleFavorite} />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Space>
        </Content>
    );
}

export default ProductPage;
