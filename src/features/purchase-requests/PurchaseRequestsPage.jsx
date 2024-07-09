import { useState, useEffect } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../api/apiClient';
import { fireErrorAlert, fireSuccessAlert, confirmDeleteAlert } from '../../utils/alerts';
import PaginationSelect from '../../components/common/PaginationSelect';
import AddPurchaseRequestModal from './AddPurchaseRequestModal';
import { ITEMS_PER_PAGE, PURCHASE_STATE } from '../../utils/constants';

const PurchaseRequestsPage = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [approvers, setApprovers] = useState([]);

  const openModal = () => setShowModal(true);
  const openEditModal = (purchaseRequest) => {
    setSelectedPurchaseRequest(purchaseRequest);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedPurchaseRequest(null);
  };

  const savePurchaseRequest = async (purchaseRequestData) => {
    const method = selectedPurchaseRequest ? 'put' : 'post';
    const url = selectedPurchaseRequest ? `purchase_requests/${selectedPurchaseRequest.id}/` : 'purchase_requests/';

    try {
      await apiClient[method](url, purchaseRequestData);
      fetchPurchaseRequests();
      fireSuccessAlert(selectedPurchaseRequest ? 'Solicitud actualizada correctamente' : 'Solicitud agregada correctamente');
    } catch (error) {
      fireErrorAlert('Error al agregar una solicitud');
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
    fetchSuppliers();
    fetchApprovers();
  }, []);

  const fetchPurchaseRequests = async (page = 1) => {
    try {
      const response = await apiClient.get(`purchase_requests/?page=${page}`);
      const total = Math.ceil(response.data.count / ITEMS_PER_PAGE);
      setTotalPages(total);
      setCurrentPage(page);
      setPurchaseRequests(response.data.results);
    } catch (error) {
      fireErrorAlert('Error al listar las solicitudes');
    }
  };

  const deletePurchaseRequest = async (id) => {
    try {
      await confirmDeleteAlert(async () => {
        await apiClient.delete(`purchase_requests/${id}`);
        fetchPurchaseRequests();
        fireSuccessAlert('Solicitud eliminada correctamente');
      });
    } catch (error) {
      fireErrorAlert('Ha ocurrido un error al eliminar una solicitud');
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

  const fetchApprovers = async () => {
    try {
      const response = await apiClient.get('users/');
      setApprovers(response.data.results);
    } catch (error) {
      fireErrorAlert('Error al listar los aprobadores');
    }
  };

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Solicitudes de compra</h1>
        <div>
          <Button onClick={openModal} variant="success">
            Nuevo solicitud <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </Button>
        </div>
      </div>

      <Table responsive className='mb-4 shadow'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Aprobado por</th>
            <th>Creado el</th>
            <th>Última actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {purchaseRequests.map(purchaseRequest => (
            <tr key={purchaseRequest.id}>
              <td>{purchaseRequest.id}</td>
              <td>{purchaseRequest.supplier && purchaseRequest.supplier.name}</td>
              <td>{purchaseRequest.total}</td>
              <td>
                {purchaseRequest.purchase_state === PURCHASE_STATE.APPROVED.id ? (
                  <Badge bg="success">{PURCHASE_STATE.APPROVED.label}</Badge>
                ): purchaseRequest.purchase_state === PURCHASE_STATE.REJECTED.id ? (
                  <Badge bg="danger">{PURCHASE_STATE.REJECTED.label}</Badge>
                ): (
                  <Badge bg="secondary">{PURCHASE_STATE.PENDING.label}</Badge>
                )}
              </td>
              <td>
                {purchaseRequest.approved_by && `${purchaseRequest.approved_by.first_name} ${purchaseRequest.approved_by.last_name}`}
              </td>
              <td>{new Date(purchaseRequest.created_at).toLocaleDateString('es-ES')}</td>
              <td>{new Date(purchaseRequest.updated_at).toLocaleDateString('es-ES')}</td>
              <td>
                <Button variant="primary" onClick={() => openEditModal(purchaseRequest)} className='me-2'>
                  Editar <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </Button>
                <Button variant="danger" onClick={() => deletePurchaseRequest(purchaseRequest.id)}>
                  Eliminar <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>  
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className='text-center'>
        <PaginationSelect currentPage={currentPage} totalPages={totalPages} func={fetchPurchaseRequests} />
      </div>

      <AddPurchaseRequestModal 
        show={showModal} 
        handleClose={closeModal} 
        savePurchaseRequest={savePurchaseRequest} 
        purchaseRequest={selectedPurchaseRequest}
        suppliers={suppliers}
        approvers={approvers}
      />
    </>
  )
};

export default PurchaseRequestsPage;