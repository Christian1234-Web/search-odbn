import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { request } from '../../../../services/utilities';
import { USER_COOKIE } from '../../../../services/constants';
import SSRStorage from '../../../../services/storage';
import { LoaderGrow } from '../../../AdvanceUi/Loader/loader';
import { Store } from '../../../../services/store';
import ReactPaginate from "react-paginate";
import { Link } from 'react-router-dom';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

// import {Loa}

function Facility() {

    const store = useContext(Store)
    const [loading, setLoading] = useState(false);
    const [arrayLength, setArrayLength] = useState('0');
    const [type, setType] = useState(null);
    const [comment, setComment] = useState('');
    const [searchArray, setSearchArray] = useState([]);
    const [practicesCategory, setPracticesCategory] = useState([])
    const [practices, setPractices] = useState([]);
    const isRenderSearch = useRef();
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [meta, setMeta] = useState(null);
    const [count, setCount] = useState(1);
    const [plans, setPlans] = useState([]);


    const handleError = () => {
        return MySwal.fire({
            text: ' Failed to fetch facilities!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
        })
    }


    const searchPractice = async (x) => {
        if (comment !== '' || type !== null) {
            setLoading(true);
            let p = x || 1
            const data = { payload: comment, type, page: p, limit: 10 }
            try {
                const url = `search/practices`;
                const rs = await request(url, 'POST', true, data);
                setSearchArray(rs.data.practice);
                setArrayLength(rs.data.practice.length);
                setMeta(rs.paging);
                setCount(Math.ceil(rs.paging.total / rowsPerPage));
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.message === 'No record') {
                    return MySwal.fire({
                        text: `${err.message}`,
                        icon: 'warning',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                handleError();
                console.log(err);
            }
        }

    }

    const fetchFacilityType = useCallback(async () => {
        let url = `plan?type=facility`;
        try {
            const rs = await request(url, 'GET', true);
            const result = rs.result.filter(e => e.type === 'facility');
            setPlans(result);

        } catch (err) {
            console.log(err);
        }
    }, []);

    const renderBySearch = searchArray.map((e, i) => {
        if (searchArray.length >= 1) {
            return (
                <tr key={i}>
                    <th scope="row"><Link to="#" className="fw-medium">{e.facilityNum}</Link></th>
                    <td>{e.name}</td>
                    <td>{e.address}</td>
                    <td>{e.nameOfRegPractitionerInCharge} </td>
                    <td>{e.isApprovedByAdmin !== true ? 'Not up to date' : 'Up to date'}</td>
                    {/* <td>
                        <div className={e.userId === null ? 'hstack flex-wrap d-none' : 'hstack flex-wrap'}>
                            <Link to={`/search-dashboard/view/facility/${e.userId}`} className="link-success btn-icon btn-sm" id="Tooltip3"><i className="ri-compass-3-line fs-16"></i></Link>

                        </div>
                        <UncontrolledTooltip placement="top" target="Tooltip3">View Details  </UncontrolledTooltip>
                    </td > */}
                </tr >
            )
        } else {
            return (
                <div className="text-danger text-center"> No record </div>
            )
        }
    })


    const handlePagination = page => {
        searchPractice(page.selected + 1)
        setCurrentPage(page.selected + 1)
    }
    // const count = Number((meta.total / rowsPerPage).toFixed(0))
    useEffect(() => {
        fetchFacilityType();
    }, [fetchFacilityType]);
    return (
        <>
            <div className="row">
                <>{loading === true ? <LoaderGrow /> : ''}</>
                <div className="col-xl-12">
                    <div className="">
                        <Row className='p-2'>

                            {/* <Col lg={12} className='d-flex'> */}
                            <Col>
                                <div>
                                    <h4 className="card-title mb-4 p-2">Registered Facilities</h4>
                                </div>
                            </Col>
                            {/* <div className="form-group m-0 mx-4" > */}
                            {/* <Row> */}
                            <Col sm={6} className="mb-2">
                                <div className="input-group">
                                    <input type="text" className="form-control" onChange={e => {
                                        setComment(e.target.value);
                                    }}
                                        placeholder="Please type first few letters of the facility name below and search"
                                        aria-label="Recipient's username" />

                                </div>
                            </Col>
                            <Col sm={2} className="mb-2">
                                <div>
                                    <select className="form-select" aria-label="Default select example" onChange={e => setType(e.target.value)}>
                                        <option selected="" value={null} className='text-capitalize'>Select facility type </option>
                                        <option selected="" value='' className='text-capitalize'>All </option>
                                        {plans.map(e => {
                                            return (
                                                <option selected="" key={e.id} value={e.name} className='text-capitalize'>{e.name}</option>

                                            )
                                        })}
                                    </select>
                                </div>
                            </Col>
                            <Col sm={2}>
                                <div className='float-end px-2'>
                                    <button onClick={() => searchPractice(1)} className="btn text-white " style={{ background: '#05B604' }} type="button"><i
                                        className="mdi mdi-magnify "></i>Search</button>
                                </div>
                            </Col>
                            {/* </Row> */}
                            {/* </div> */}
                            {/* </Col> */}
                        </Row>

                        {arrayLength >= 1 ? <div className="card-body pt-4 table-responsive">
                            <Table>
                                <thead>
                                    <tr>
                                        <th scope="col">Facility Number</th>
                                        <th scope="col">Facility Name</th>
                                        <th scope="col">Facility Address</th>
                                        <th scope="col">Optometrist In Charge</th>
                                        <th scope="col"> Status</th>
                                        {/* <th scope="col">License History</th> */}
                                    </tr>
                                </thead>
                                <tbody>{renderBySearch}</tbody>
                            </Table>
                            <div>
                                <ReactPaginate
                                    nextLabel='Next'
                                    breakLabel='...'
                                    previousLabel='Prev'
                                    pageCount={count}
                                    activeClassName='active'
                                    breakClassName='page-item'
                                    pageClassName={'page-item'}
                                    breakLinkClassName='page-link'
                                    nextLinkClassName={'page-link'}
                                    pageLinkClassName={'page-link'}
                                    nextClassName={'page-item next'}
                                    previousLinkClassName={'page-link'}
                                    previousClassName={'page-item prev'}
                                    onPageChange={page => handlePagination(page)}
                                    forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                                    containerClassName={'pagination react-paginate justify-content-end   p-1'}

                                />
                            </div>
                            <div className="align-items-center mt-2 row g-3 text-center text-sm-start">
                                <div className="col-sm">
                                    <div className="text-muted">Available Results <span className="fw-semibold">
                                        {arrayLength}
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </div> : ''}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Facility