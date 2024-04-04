package com.drivingschool.service.impl;

import com.drivingschool.domain.Assurance;
import com.drivingschool.repository.AssuranceRepository;
import com.drivingschool.service.AssuranceService;
import com.drivingschool.service.dto.AssuranceDTO;
import com.drivingschool.service.mapper.AssuranceMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.drivingschool.domain.Assurance}.
 */
@Service
@Transactional
public class AssuranceServiceImpl implements AssuranceService {

    private final Logger log = LoggerFactory.getLogger(AssuranceServiceImpl.class);

    private final AssuranceRepository assuranceRepository;

    private final AssuranceMapper assuranceMapper;

    public AssuranceServiceImpl(AssuranceRepository assuranceRepository, AssuranceMapper assuranceMapper) {
        this.assuranceRepository = assuranceRepository;
        this.assuranceMapper = assuranceMapper;
    }

    @Override
    public AssuranceDTO save(AssuranceDTO assuranceDTO) {
        log.debug("Request to save Assurance : {}", assuranceDTO);
        Assurance assurance = assuranceMapper.toEntity(assuranceDTO);
        assurance = assuranceRepository.save(assurance);
        return assuranceMapper.toDto(assurance);
    }

    @Override
    public AssuranceDTO update(AssuranceDTO assuranceDTO) {
        log.debug("Request to update Assurance : {}", assuranceDTO);
        Assurance assurance = assuranceMapper.toEntity(assuranceDTO);
        assurance = assuranceRepository.save(assurance);
        return assuranceMapper.toDto(assurance);
    }

    @Override
    public Optional<AssuranceDTO> partialUpdate(AssuranceDTO assuranceDTO) {
        log.debug("Request to partially update Assurance : {}", assuranceDTO);

        return assuranceRepository
            .findById(assuranceDTO.getId())
            .map(existingAssurance -> {
                assuranceMapper.partialUpdate(existingAssurance, assuranceDTO);

                return existingAssurance;
            })
            .map(assuranceRepository::save)
            .map(assuranceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssuranceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Assurances");
        return assuranceRepository.findAll(pageable).map(assuranceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AssuranceDTO> findOne(Long id) {
        log.debug("Request to get Assurance : {}", id);
        return assuranceRepository.findById(id).map(assuranceMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Assurance : {}", id);
        assuranceRepository.deleteById(id);
    }
}
