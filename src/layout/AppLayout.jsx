import {
  Button, Col, Layout, Menu, Popconfirm, Row,
} from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

import LocalStorageHelper from '../helpers/localstorage-helper';

import './AppLayout.css';

const { Header, Footer } = Layout;

/**
 * Define as rotas do menu principal da aplicação.
 */
const MENU_ITEMS = [
  {
    path: '/product',
    label: 'Loja',
  },
  {
    path: '/favorite',
    label: 'Meus favoritos',
  },
];

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    /**
     * Detecta qual a página que está aberta no momento para marcar o menu como selecionado.
     */
    const currentRoute = MENU_ITEMS.find((item) => matchPath(item.path, location.pathname));

    if (!currentRoute) return [];

    return [currentRoute.path];
  }, [location]);

  const renderMenuItem = (item) => (
    {
      key: item.path,
      label: item.label,
    }
  );

  const handleLogout = useCallback(() => {
    LocalStorageHelper.removeToken();
    navigate('/login');
  }, [navigate]);

  const handleMenuClick = useCallback((item) => {
    navigate(item.key);
  }, [navigate]);

  return (
    <Layout className="AppLayout_layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          background: '#262626'
        }}
      >
        <h1
          style={{
            height: 60,
            marginLeft: 16,
            marginRight: 16,
            background: '#262626',
            fontSize: '30px',
            color: 'white'
          }}
        >
         NetXoes 
        </h1>

        <Menu
          style={{
            flex: 1,
            background: '#262626',
          }}
          selectedKeys={selectedKeys}
          mode="horizontal"
          theme="dark"
          items={MENU_ITEMS.map(renderMenuItem)}
          onClick={handleMenuClick}
        />

        <Popconfirm
          onConfirm={handleLogout}
          okText="Sair"
          okType="danger"
          cancelText="Cancelar"
          title="Deseja sair do sistema?"
          placement="leftTop"
        >
          <Button
            type="text"
            danger
          >
            Sair
          </Button>
        </Popconfirm>
      </Header>

      {children}

      <Footer>
        <Row justify="center">
          <Col>
            Bootcamp DB1 © 2023
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}

export default AppLayout;
