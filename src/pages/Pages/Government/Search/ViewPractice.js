import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { request } from '../../../../services/utilities';
import { USER_COOKIE } from '../../../../services/constants';
import SSRStorage from '../../../../services/storage';
import { LoaderGrow } from '../../../AdvanceUi/Loader/loader';
import { Store } from '../../../../services/store';
import HeaderIndex from '../Admin/Layout';

import ReactPaginate from "react-paginate";
import { Link, useParams } from 'react-router-dom';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import logoLight from "../../../../assets/images/odorbnlogo.png";

import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

// import {Loa}

function ViewPractice() {

    const store = useContext(Store)
    const [loading, setLoading] = useState(false);

    const [practices, setPractices] = useState([]);
    const [user, setUser] = useState([]);

    const [viewOp, setViewOp] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [meta, setMeta] = useState(null);
    const [count, setCount] = useState(1);


    const handleError = () => {
        return MySwal.fire({
            title: 'Sorry!',
            text: ' Failed to fetch facilities!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
        })
    }

    const id = useParams();
    const type = useParams();
    console.log(type.type)

    const fetchPractices = useCallback(async (page) => {
        const p = page || 1;
        const url = `practices/user/${id.id}?limit=10&page=${p}`;

        try {
            setLoading(true);
            const rs = await request(url, 'GET', true);
            setPractices(rs?.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.message === 'No record') {
                setPractices([]);
            } else {
                handleError();
            }
            console.log(err);
        }
    }, [id.id]);

    useEffect(() => {
        fetchPractices();
    }, [fetchPractices]);



    // const handlePagination = page => {
    //     fetchPractices(page.selected + 1)
    //     setCurrentPage(page.selected + 1)
    // }
    // const count = Number((meta.total / rowsPerPage).toFixed(0))
    const renderFacility = practices?.map((e, i) => {
        if (practices.length > 0) {
            return (
                <tr key={i}>
                    <th scope="row"><Link to="#" className="fw-medium">{i}</Link></th>
                    <td>  {e.name} </td>
                    <td>  {e.address} </td>
                    <td>{new Date(e.createdAt).toDateString()}</td>
                    <td>{e.status !== "Approved" ? <span className="ri-close-circle-line align-middle text-danger"><span className='text-dark mx-1'>{e.status}</span></span> :
                        <span className="ri-checkbox-circle-line align-middle text-success"><span className='mx-1'>{e.status}</span></span>
                    }
                    </td>
                    <td>{e.isApprovedByAdmin !== true ? 'false' : 'true'}</td>
                    <td>{e.isApprovedByAdmin !== true ? 'Unapproved' : 'Approved'}</td>
                </tr >
            )
        } else {
            return (
                <div className="text-danger text-center"> No record </div>
            )
        }
    });
    return (
        <>
            <div className='w-100'>
                <HeaderIndex />
            </div>
            <div className="page-content mt-5">
                <div className="container-fluid p-5">
                    <div className="row">
                        <>{loading === true ? <LoaderGrow /> : ''}</>

                        <div className="align-items-start card" style={{ background: '#05B604' }}>
                            <div className="col-sm-8 w-100">
                                <div className="p-3 row justify-content-between">
                                    <Col>
                                        <p className="fs-16 lh-base text-white fw-semibold"> License History For {practices[0]?.createdBy || '-- '}
                                            with id. no. {id.id || '--'}
                                        </p>
                                    </Col>
                                    <Col lg={4}>
                                        <img
                                            src={logoLight}
                                            className="card-logo card-logo-dark"
                                            alt="logo dark"
                                            height="70"
                                            width='100%'
                                        />
                                        <img
                                            src={logoLight}
                                            className="card-logo card-logo-light"
                                            alt="logo light"
                                            height="70"
                                            width='100%'

                                        />
                                    </Col>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="card">
                                <Row className='align-items-center'>
                                    <Col>
                                        <h4 className="card-title mb-0 text-capitalize p-4">Registered {type.type}</h4>

                                    </Col>
                                </Row>

                                <div className="card-body pt-4 table-responsive">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Practice Name</th>
                                                <th scope="col">Practice Address</th>
                                                <th scope="col">Registered Date</th>
                                                <th scope="col">User Status</th>
                                                <th scope="col">Is Recommended</th>
                                                <th scope="col">Approval</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderFacility}
                                        </tbody>
                                    </Table>
                                    <div className="align-items-center mt-2 d-flex justify-content-between">
                                        <Link to='/'>
                                            <div className="">
                                                <button className="btn text-white" style={{ background: '#05B604' }}>
                                                    Go Back
                                                </button>
                                            </div>
                                        </Link>
                                        <div className="text-muted">Available Results <span className="fw-semibold">
                                            {practices.length || '1'}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ViewPractice;