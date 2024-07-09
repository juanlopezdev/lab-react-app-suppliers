
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

const PaginationSelect = ({currentPage, totalPages, func}) => {
  return (
    <Form.Select value={currentPage} onChange={e => func(Number(e.target.value))} className='strc-pagination-select'>
      {Array.from({ length: totalPages }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          Página {i + 1}
        </option>
      ))}
    </Form.Select>
  );
};

PaginationSelect.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  func: PropTypes.func.isRequired
};

export default PaginationSelect;