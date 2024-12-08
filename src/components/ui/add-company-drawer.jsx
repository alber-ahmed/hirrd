import React, { useEffect } from 'react'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'  
import { Input } from '@/components/ui/input'
import { addNewCompany } from '@/api/apiCompanies'
import useFetch from '@/hooks/use-fetch'
import { BarLoader } from 'react-spinners'

const schema = z.object({
    name: z.string().min(1, {message: "Company name is required"}),
    logo: z
    .any()
    .refine(file=>file[0] && 
        (file[0].type === "image/png" ||
            file[0].type === "image/jpeg"
        ),
        { message: "Only Images are allowed"}
    ),
})
const AddCompanyDrawer = ({ fetchCompanies }) => {

    const {register, handleSubmit,control,formState: { errors },reset} = useForm({
        resolver: zodResolver(schema),
    })

  const { fn: fnAddCompany, data: dataAddCompany, loading: loadingAddCompany, error: errorAddCompany } = 
  useFetch(addNewCompany);
    const onSubmit = (data)=>{
      fnAddCompany({
        ...data,
        logo:data.logo[0],
      })
    }
  useEffect(() => {
    if (dataAddCompany?.length>0) fetchCompanies()
  }, [loadingAddCompany])
    
  return (
    <Drawer>
  <DrawerTrigger>
    <Button size="sm" variant= "secondary" type="button">Add Company</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Add a New Company</DrawerTitle>
    </DrawerHeader>
    <form className='flex gap-2 p-4 pb-0'>
      <Input placeholder="Company name" {...register("name")}/>
      <Input type="file" accept="image/*" className='file:text-gray-500' {...register("logo")}/>
      <Button type="button" onClick={handleSubmit(onSubmit)} variant="destructive" className='w-40'>
        Add
      </Button>
    </form>

    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
    {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
    {loadingAddCompany && <BarLoader width={"100%"} color='#36d7b7'/>}
    {errorAddCompany?.message && (
      <p className='text-red-500'>{errorAddCompany?.message}</p>
    )}
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="secondary" type='button'>Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

  )
}

export default AddCompanyDrawer