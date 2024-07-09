import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const AddProductModal = ({ show, handleClose, saveProduct, product, suppliers}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    if (product) {
      Object.keys(product).forEach(key => {
        let value = product[key];
        if (key === 'supplier') 
          value = product[key].id || null;
        setValue(key, value);
      });
    } else {
      reset();
    }
  }, [product, setValue, reset]);

  const onSubmit = async (data) => {
    await saveProduct(data);
    handleClose();
    reset();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product ? "Editar Producto" : "Añadir Producto"}</Modal.Title>
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
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descripción del producto"
              {...register('description', { required: 'Este campo es requerido' })}
            />
            {errors.description && <div className="text-danger">{errors.description.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="Link del producto"
              {...register('url', { 
                required: 'Este campo es requerido',
                pattern: { 
                  value: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
                  message: "URL inválido" },
              })}
            />
             {errors.url && <div className="text-danger">{errors.url.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio ($)</Form.Label>
            <Form.Control
              type="decimal"
              placeholder="Precio en dólares"
              {...register('price', { required: 'Este campo es requerido' })}
            />
            {errors.price && <div className="text-danger">{errors.price.message}</div>}
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  saveProduct: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  suppliers: PropTypes.array.isRequired
};

export default AddProductModal;
