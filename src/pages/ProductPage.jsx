import { Content } from 'antd/es/layout/layout';
import { Card, Modal, Row, Col, Typography, Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const { Header } = Layout;
const { Title, Paragraph } = Typography;
const parcelaMinima = 10;

const calculateInstallments = (price) => {
    const quantidadeMaximaDeParcelas = Math.floor(price / parcelaMinima);
    const totalComJuros = price * quantidadeMaximaDeParcelas * 1.0199;
    const totalDasParcelasComJuros = (totalComJuros / quantidadeMaximaDeParcelas ).toFixed(2);
    if(quantidadeMaximaDeParcelas === 0 ){
        return;
    } else {
        return `Máximo de parcelas: ${quantidadeMaximaDeParcelas} vezes de R$ ${(totalDasParcelasComJuros/quantidadeMaximaDeParcelas).toFixed(2)} com juros de 1.99% am.`
    }
    

};

function ProductDetailPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const requestProduct = async () => {
        try {
            setLoading(true);
            const productResponse = await axios.get(`/product/${productId}`);
            setProduct(productResponse.data);

            const favoriteResponse = await axios.get(`/favorite`);
            const favoriteList = favoriteResponse.data;

            const isFav = favoriteList.some(fav => fav.ProductId == productId);
            setIsFavorite(isFav);
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: 'Não foi possível carregar o produto, tente novamente mais tarde.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        try {
            if (isFavorite) {
                await axios.delete(`/favorite/${productId}`);
                setIsFavorite(false);
                Modal.success({
                    title: 'Produto desfavoritado com sucesso!',
                });
            } else {
                await axios.post(`/favorite/${productId}`);
                setIsFavorite(true);
                Modal.success({
                    title: 'Produto favoritado com sucesso!',
                });
            }
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: `Não foi possível ${isFavorite ? 'desfavoritar' : 'favoritar'} o produto, tente novamente mais tarde.`,
            });
        }
    };

    useEffect(() => {
        requestProduct();
    }, [productId]);

    if (loading || !product) {
        return (
            <Content style={{ padding: '0 50px' }}>
                <div>Carregando...</div>
            </Content>
        );
    }

    const ResultadosJuros = calculateInstallments(product.price);

    return (
        <Content style={{ padding: '0 50px' }}>
            <Header style={{ background: '#fff', padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
                    <div>
                        <Link to="/">
                            <Button type="primary">Voltar para a Página Principal</Button>
                        </Link>
                    </div>
                    <div>
                        {/* Outros elementos do cabeçalho podem ser adicionados aqui */}
                    </div>
                </div>
            </Header>
            <Row justify="center">
                <Col span={12}>
                    <Card
                        cover={product.imageUrl ? <img alt={product.name} src={product.imageUrl} /> : <div style={{ height: 400, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem Imagem</div>}
                    >
                        <Title level={2}>{product.name}</Title>
                        <Paragraph>{product.description}</Paragraph>
                        <Title level={4}>Preço: R$ {product.price.toFixed(2)}</Title>
                        <Paragraph>
                            {ResultadosJuros}
                        </Paragraph>
                        <Button type="primary" onClick={handleToggleFavorite}>
                            {isFavorite ? 'Desfavoritar' : 'Favoritar'}
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

export default ProductDetailPage;
