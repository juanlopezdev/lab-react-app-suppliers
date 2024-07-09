import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../api/apiClient';
import { fireErrorAlert, fireSuccessAlert, confirmDeleteAlert } from '../../utils/alerts';
import PaginationSelect from '../../components/common/PaginationSelect';
import AddProductModal from './AddProductModal';
import { ITEMS_PER_PAGE } from '../../utils/constants';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const openModal = () => setShowModal(true);
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const saveProduct = async (productData) => {
    const method = selectedProduct ? 'put' : 'post';
    const url = selectedProduct ? `products/${selectedProduct.id}/` : 'products/';

    try {
      await apiClient[method](url, productData);
      fetchProducts();
      fireSuccessAlert(selectedProduct ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
    } catch (error) {
      fireErrorAlert('Error al agregar un producto');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async (page = 1) => {
    try {
      const response = await apiClient.get(`products/?page=${page}`);
      const total = Math.ceil(response.data.count / ITEMS_PER_PAGE);
      setTotalPages(total);
      setCurrentPage(page);
      setProducts(response.data.results);
    } catch (error) {
      fireErrorAlert('Error al listar los products');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await confirmDeleteAlert(async () => {
        await apiClient.delete(`products/${id}`);
        fetchProducts();
        fireSuccessAlert('Producto eliminado correctamente');
      });
    } catch (error) {
      fireErrorAlert('Ha ocurrido un error al eliminar un producto');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await apiClient.get('suppliers/');
      setSuppliers(response.data.results);
    } catch (error) {
      fireErrorAlert('Error al listar los proveedores');
    }
  };

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Productos</h1>
        <div>
          <Button onClick={openModal} variant="success">
            Nuevo producto <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </Button>
        </div>
      </div>
      
      <Table responsive className='mb-4 shadow'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>URL</th>
            <th>Precio($)</th>
            <th>Proveedor</th>
            <th>Creado el</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.description}</td>
              <td>
                {product.url && <a href={product.url} target='_blank'> Link de producto</a>}</td>
              <td>{product.price}</td>
              <td>{product.supplier.name}</td>
              <td>
                {new Date(product.created_at).toLocaleDateString('es-ES')}
              </td>
              <td>
                <Button variant="primary" onClick={() => openEditModal(product)} className='me-2'>
                  Editar <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </Button>
                <Button variant="danger" onClick={() => deleteProduct(product.id)}>
                  Eliminar <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>  
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className='text-center'>
        <PaginationSelect currentPage={currentPage} totalPages={totalPages} func={fetchProducts} />
      </div>

      <AddProductModal 
        show={showModal} 
        handleClose={closeModal} 
        saveProduct={saveProduct} 
        product={selectedProduct} 
        suppliers={suppliers}
      />
    </>
  );
};

export default ProductsPage;