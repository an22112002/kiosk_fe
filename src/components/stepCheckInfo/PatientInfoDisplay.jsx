export default function PatientInfoDisplay({ patientInfo, npInfo }) {
  return (
    <div className='flex justify-center'>
      <div className='w-full sm:w-[80%] lg:w-[45vw] grid grid-cols-3 gap-4 text-left'>
        {/* Cột 1: Ảnh */}
        <div className='flex justify-center items-start'>
          {patientInfo?.faceImage?.data?.img_data ? (
            <img
              src={patientInfo.faceImage.data.img_data}
              alt='Ảnh công dân'
              className='w-32 h-40 object-cover rounded-lg border'
            />
          ) : null}
        </div>

        {/* Cột 2: Tên các trường */}
        <div className='flex flex-col justify-start gap-2 font-semibold text-gray-700'>
          <span>Họ và tên:</span>
          <span>Ngày sinh:</span>
          <span>Giới tính:</span>
          <span>Quốc tịch:</span>
          <span>Quê quán:</span>
          <span>Địa chỉ thường trú:</span>
          <span>Số điện thoại:</span>
        </div>

        {/* Cột 3: Thông tin tương ứng */}
        <div className='flex flex-col justify-start gap-2 text-gray-800'>
          <span>{patientInfo?.personalInfo?.data?.personName || "?"}</span>
          <span>{patientInfo?.personalInfo?.data?.dateOfBirth || "?"}</span>
          <span>{patientInfo?.personalInfo?.data?.gender || "?"}</span>
          <span>{patientInfo?.personalInfo?.data?.nationality || "?"}</span>
          <span>{patientInfo?.personalInfo?.data?.originPlace || "?"}</span>
          <span>{patientInfo?.personalInfo?.data?.residencePlace || "?"}</span>
          <span>{patientInfo?.patientHISInfo?.DIEN_THOAI || npInfo?.phone || "?"}</span>
        </div>
      </div>
    </div>
  )
}