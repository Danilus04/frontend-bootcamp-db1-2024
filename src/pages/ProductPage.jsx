import { Content } from 'antd/es/layout/layout';
import { Card, Modal, Row, Col, Typography, Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const { Header } = Layout;

const { Title, Paragraph } = Typography;

const calculateInstallments = (price) => {
    const minInstallmentValue = 10.0;
    const interestRate = 1.99 / 100;
    const maxInstallments = Math.floor(price / minInstallmentValue);
    const installments = [];

    for (let n = 1; n <= maxInstallments; n++) {
        const installmentValue = price * Math.pow(1 + interestRate, n) / n;
        if (installmentValue >= minInstallmentValue) {
            installments.push({ n, installmentValue });
        }
    }

    return installments;
};

function ProductDetailPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const requestProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/product/${productId}`); // Ajuste a URL para o endpoint correto da sua API
            setProduct(response.data);
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: 'Não foi possível carregar o produto, tente novamente mais tarde.',
            });
        } finally {
            setLoading(false);
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

    const installments = calculateInstallments(product.price);

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
                            Máximo de parcelas: {installments.length} vezes de R$ {installments.length > 0 ? installments[installments.length - 1].installmentValue.toFixed(2) : 0} com juros de 1.99% am.
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

//TODO: Máximo de parcelas ajustado caso não de para ter nenhuma percela

export default ProductDetailPage;
