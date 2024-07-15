import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import apiClient from '../../api/apiClient';

const AddPurchaseRequest = ({ show, handleClose,  suppliers, approvers, savePurchaseRequest, purchaseRequest}) => {
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      supplier: suppliers.length > 0 ? suppliers[0].id : null,
    }
  });
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const selectedSupplierId = watch('supplier');

  useEffect(() => {
    if (purchaseRequest) {
      Object.keys(purchaseRequest).forEach(key => {
        let value = purchaseRequest[key];
        if (key === 'supplier') 
          value = value ? value.id : null;
        if (key === 'approved_by') 
          value = value ? value.id : null;
        setValue(key, value);
      });
    } else {
      reset();
      setDetails([]);
    }
  }, [purchaseRequest, setValue, reset]);

  useEffect(() => {
    setDetails([]);

    const fetchProducts = async () => {
      if (selectedSupplierId) {
        try {
          const response = await apiClient.get(`products/?supplier=${selectedSupplierId}`);
          setProducts(response.data.results);
        } catch (error) {
          console.error('Error fetching products', error);
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedSupplierId]);

  // Calculate total when details change
  useEffect(() => {
    const total = calculateTotal();
    setValue('total', total);
  }, [details]);

  const handleAddDetail = () => {
    const newDetail = { 
      product: products.length > 0 ? products[0].id : null,
      price_unit: products.length > 0 ? products[0].price : 0,
      quantity: 1
    };
    setDetails([...details, newDetail]);
  };

  const handleRemoveDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    switch (field) {
      case 'product': updateDetailPriceByProductId(index, value); break;
      case 'quantity': newDetails[index].quantity = value || 1; break;
      default: newDetails[index][field] = value; break;
    }
    setValue('total', calculateTotal());
    setDetails(newDetails);
  };

  const calculateTotal = () => {
    return details.reduce((acc, detail) => acc + (detail.quantity * detail.price_unit), 0);
  };

  const updateDetailPriceByProductId = (detailIndex, productId) => {
    const newDetails = [...details];
    const selectedProduct = products.find((product) => product.id == productId);
    newDetails[detailIndex].price_unit = selectedProduct ? selectedProduct.price : 0;
  };

  const onSubmit = async (data) => {
    const total = calculateTotal();
    console.log({ ...data, total, details });
    await savePurchaseRequest(data);
    handleClose();
    reset();
  };

  return (
    <Modal show={show} onHide={handleClose} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>{purchaseRequest ? "Editar solicitud de compra" : "Añadir solicitud de compra"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Proveedor</Form.Label>
            <Form.Select {...register('supplier', { required: 'Este campo es requerido' })}>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </Form.Select>
            {errors.supplier && <div className="text-danger">{errors.supplier.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="text"
              placeholder="Total"
              readOnly={true}
              {...register('total', { required: 'Este campo es requerido' })}
            />
             {errors.total && <div className="text-danger">{errors.total.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Aprobado por</Form.Label>
            <Form.Select {...register('approved_by', { required: 'Este campo es requerido' })}>
              {approvers.map((approver) => (
                <option key={approver.id} value={approver.id}>{approver.first_name} {approver.last_name}</option>
              ))}
            </Form.Select>
            {errors.approved_by && <div className="text-danger">{errors.approved_by.message}</div>}
          </Form.Group>
          
          <div>
            <hr className='my-4'/>
            <h2>Detalle de solicitud</h2>
            <p>
              {selectedSupplierId ? 
                'Agrega productos a tu solicitud' : 
                'Para agregar un producto, primero debes seleccionar un proveedor'}
            </p>

            {details.map((detail, index) => (
              <div key={index} className="mb-3">
                <Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Producto</Form.Label>
                    <Form.Select 
                      value={detail.product}
                      onChange={(e) => handleDetailChange(index, 'product', e.target.value)}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.description}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      value={detail.quantity}
                      min={1}
                      onChange={(e) => handleDetailChange(index, 'quantity', parseInt(e.target.value, 10))}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Precio Unitario</Form.Label>
                    <Form.Control
                      type="number"
                      value={detail.price_unit}
                      readOnly={true}
                      onChange={(e) => handleDetailChange(index, 'price_unit', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="2" className="d-flex align-items-end">
                    <Button variant="danger" onClick={() => handleRemoveDetail(index)}>
                      Eliminar
                    </Button>
                  </Form.Group>
                </Row>
              </div>
            ))}

            {selectedSupplierId && (
              <Button 
                variant="light" 
                onClick={handleAddDetail} 
                className='mb-4'>
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Añadir producto
              </Button>
            )}
          </div>

          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddPurchaseRequest.propTypes = {
  show: PropTypes.bool.isRequired,
  savePurchaseRequest: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  purchaseRequest: PropTypes.object,
  suppliers: PropTypes.array,
  approvers: PropTypes.array
};

export default AddPurchaseRequest;