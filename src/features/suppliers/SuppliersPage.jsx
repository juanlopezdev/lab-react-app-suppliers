import { useState, useEffect } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faEnvelope, faMobile, faTrash } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../api/apiClient';
import { fireErrorAlert, fireSuccessAlert, confirmDeleteAlert } from '../../utils/alerts';
import PaginationSelect from '../../components/common/PaginationSelect';
import AddSupplierModal from './AddSupplierModal';
import { ITEMS_PER_PAGE } from '../../utils/constants';


const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const openModal = () => setShowModal(true);
  const openEditModal = (supplier) => {
    console.log(supplier);
    setSelectedSupplier(supplier);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  const saveSupplier = async (supplierData) => {
    const method = selectedSupplier ? 'put' : 'post';
    const url = selectedSupplier ? `suppliers/${selectedSupplier.id}/` : 'suppliers/';

    try {
      await apiClient[method](url, supplierData);
      fetchSuppliers();
      fireSuccessAlert(selectedSupplier ? 'Proveedor actualizado correctamente' : 'Proveedor agregado correctamente');
    } catch (error) {
      fireErrorAlert('Error al agregar un proveedor');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async (page = 1) => {
    try {
      const response = await apiClient.get(`suppliers/?page=${page}`);
      const total = Math.ceil(response.data.count / ITEMS_PER_PAGE);
      setTotalPages(total);
      setCurrentPage(page);
      setSuppliers(response.data.results);
    } catch (error) {
      fireErrorAlert('Error al listar los proveedores');
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await confirmDeleteAlert(async () => {
        await apiClient.delete(`suppliers/${id}`);
        fetchSuppliers();
        fireSuccessAlert('Proveedor eliminado correctamente');
      });
    } catch (error) {
      fireErrorAlert('Ha ocurrido un error al eliminar un proveedor');
    }
  };

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Proveedores</h1>
        <div>
          <Button onClick={openModal} variant="success">
            Nuevo proveedor <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </Button>
        </div>
      </div>
      
      <Table responsive className='mb-4 shadow'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Creado el</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>
                <div>{supplier.name}</div>
                {supplier.is_partnership && (
                   <Badge bg="primary">Proveedor asociado</Badge>
                )}
              </td>
              <td>
                {supplier.address && <div>{supplier.address}</div>}
                {supplier.email && <div><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon> {supplier.email}</div>}
                {supplier.phone && <div><FontAwesomeIcon icon={faMobile}></FontAwesomeIcon> {supplier.phone}</div>}
              </td>
              <td>
                {new Date(supplier.created_at).toLocaleDateString('es-ES')}
              </td>
              <td>
                <Button variant="primary" onClick={() => openEditModal(supplier)} className='me-2'>
                  Editar <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </Button>
                <Button variant="danger" onClick={() => deleteSupplier(supplier.id)}>
                  Eliminar <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>  
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className='text-center'>
        <PaginationSelect currentPage={currentPage} totalPages={totalPages} func={fetchSuppliers} />
      </div>

      <AddSupplierModal show={showModal} handleClose={closeModal} saveSupplier={saveSupplier} supplier={selectedSupplier} />
    </>
  );
};

export default SuppliersPage;