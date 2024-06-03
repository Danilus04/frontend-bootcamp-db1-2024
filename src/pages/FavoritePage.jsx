import { Content } from 'antd/es/layout/layout';
import { Card, Button, List, Modal, Space, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente de Produto Favorito
const FavoriteProduct = ({ product, onRemove }) => (
    <Card
        hoverable
        style={{ marginBottom: 16 }}
        cover={
            <Link to={`/product/${product.id}`}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '100%', 
                    height: '300px',
                }}>
                    {product.imageUrl ? (
                    <img 
                        alt={product.name} 
                        src={product.imageUrl} 
                        style={{
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto'
                        }} 
                    />
                    ) : (
                    <div
                        style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        }}
                    >
                        Sem Imagem
                    </div>
                    )}
                </div>
            </Link>
        }
    >
        <Card.Meta
            title={<Link to={`/product/${product.id}`} style={{color: '#000000'}}>{product.name}</Link>}
            description={product.description}
        />
        <Button type="primary" danger onClick={() => onRemove(product.id)} style={{ marginTop: 16, backgroundColor: '#000000' }}>
            Remover
        </Button>
    </Card>
);

// Página de Favoritos
function FavoritePage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const requestFavorite = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/favorite');
            setFavorites(response.data);
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: 'Não foi possível carregar seus favoritos, tente novamente mais tarde.',
            });
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (favoriteId) => {
        try {
            setLoading(true);
            await axios.delete(`/favorite/${favoriteId}`);
            await requestFavorite();
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
        requestFavorite();
    }, []);

    const handleRemove = async (id) => {
        await removeFavorite(id);
        setFavorites(favorites.filter(favorite => favorite.Product.id !== id));
    };

    return (
        <Content style={{ padding: '0 50px' }}>
            <h1>Favoritos</h1>
            <Space direction="vertical" style={{ display: 'flex' }}>
                <Row justify="center">
                    <Col span={23}>
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={favorites}
                            loading={loading}
                            renderItem={favorite => (
                                <List.Item>
                                    <FavoriteProduct 
                                        product={favorite.Product} 
                                        onRemove={handleRemove} 
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Space>
        </Content>
    );
}

export default FavoritePage;
