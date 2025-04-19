'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id as string;
    const from = searchParams.get('from');
    const handleBack = () => {
        if (from === 'table') {
            router.push('/admin/manage_product');
        } else if (from === 'detail') {
            router.push(`/admin/manage_product/${id}/detail`);
        } else {
            router.push('/admin/manage_product'); // fallback
        }
    };
    return (
        <div>
            <div>This is Edit product page {id}</div>
            <div>
                <ArrowBackOutlinedIcon
                    onClick={handleBack}
                    sx={{ cursor: 'pointer', color: 'black', ":hover": { color: 'grey' }, alignSelf: 'center' }}
                />
                {/* Form chỉnh sửa sản phẩm */}
            </div>
        </div>)

} 