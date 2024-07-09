import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
      <div className='d-flex flex-column justify-content-between vh-100'>
        <div>
          <Navbar />
          <Container className='py-4'>
              {children}
          </Container>
        </div>
        <Footer/>
      </div>
    );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;